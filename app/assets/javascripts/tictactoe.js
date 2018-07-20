// Code your JavaScript / jQuery solution here
$( document ).ready(function() {
  attachListeners();
});//end document.ready

/// SET Variables
let boardFull = false;
let message = "";
let winner = "";
let gameSaved = false;
let gameId = 0;
let squares = $('td').get()
var turn = 0;

const WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2]
];
////// End set variables

////////////////////////////////////////////////////////////////

function attachListeners(){
  //// Adds click listener to call doTurn if square is clicked
  $( "td" ).click(function() {
    if ((this.innerHTML.trim() === '') && checkWinner() === false) {
      doTurn(this);
    };
  });

  //// Click function to previous button that loads all the previous games as buttons into the DOM
  $("#previous").click(function() {
    $("#games").empty(); // clear the div so that only new games are loaded
    $.get("/games", function(response) {
        var gamesString = ``;
        var gamesArray = response.data;
        $.each(gamesArray, function(i, item) {
            gamesString += `<button id="${item.id}">${item.id}</button>`;
        });
        $("#games").append(gamesString);
    });
  });

/// Click function that saves or updates the game
  $("#save").click(function() {
    gameSaved ? updateGame():saveGame(); // if the game has been saved update, otherwise save the game
  });

  /// Clears the game board if clear button is clicked
  $("#clear").click(function() {
    if (gameSaved === true) {
      resetBoard();
      gameSaved = false;
    };
    if (gameSaved === false) {
      resetBoard();
    };
  });

/// loads the previous games if the saved games buttons are clicked
  /// has to be able to grab the buttons that were added after the DOM was loaded
  $(document).on('click', '#games :button', function(){
      $.get(`/games/${this.id}`, function(response) {
        var savedBoard = response.data.attributes.state; //get the saved board array
        fillSquares(savedBoard);
        turnCount(savedBoard);
        gameSaved = true;
      });
  });

};
/////////////////////// end listeners

///// HELPER METHODS

function fillSquares(savedBoard){
  $.each(squares, function( index, value ) {// adds the saved boards values to the current board
    value.innerHTML= savedBoard[index];
  });
};

/// check how serializer works for this
function saveGame() { /// Saves the game to the database
  $.post('/games', {"state": getBoard()}).done(function(data) {
    var game = data;
    gameId = game.data.id;
    gameSaved = true;
  });
};

function updateGame(){
  $.ajax({
    url: `/games/${gameId}`,
    type: 'PATCH',
    data: {"state": getBoard()}
  });
}

function turnCount(savedBoard){
  let turnCount = 0;
  $.each(savedBoard, function( index, value ){
    if (value === 'X' || value === 'Y'){
      turnCount ++;
    }
  });
  turn = turnCount+1;
};

function setMessage(string) {
  $( "#message" ).html(string);
}

function checkForX(element){
  return ( (element === "X"));
}
function checkForO(element){
  return ( (element === "O"));
}

function checkforEmpty(element){
  return (element === ' ')//trim()
}

function getBoard(){
  return squares.map(square => square.innerHTML); //returns an array of board values, the "X"'s and "O"'s
}

function fullBoard(boardArray){
  if ( boardArray.includes('') || boardArray.includes(' ')) {
   boardFull = false;
 } else {
   boardFull = true;
 }
 return boardFull;
}

function resetBoard(){
  squares.forEach(function(element){
    element.innerHTML = '';
  });
  turn = 0;
}

function checkCombinations(answer,testArray){
  WIN_COMBINATIONS.forEach(function(combo){ //returns array of winning combinations, ex. [0,1,2]
    combo.forEach(function(index){
      testArray.push(getBoard()[index]) //push in the value at that index either "X","Y", or ""
    });
    if (testArray.every(checkForX)) {
     answer = true;
     winner = "X"
   } else if (testArray.every(checkForO)) {
      answer = true;
      winner = "O"
    };
    testArray = [];
  });
  return answer;
};


function checkWinner() {
  var answer = false;
  var testArray = [];
  message = "";
  answer = checkCombinations(answer,testArray);

  if (answer === true ){
    message = `Player ${winner} Won!`
    setMessage(message);
  };

  return answer;
}//end checkWinner


function isEven(num) {
  return num % 2 === 0;
}

function player() {
  let player = "O";
  debugger;
  if ( isEven(turn) ) { //if the turn is an even number, player is X
    player = "X"
  };
  return player;
};

function updateState(square) {
  let token = player();
  square.innerHTML = token;
}

function doTurn(square) {
  updateState(square); // add X or O to the board
  turn += 1;

  if ( checkWinner() === true ) { // check to see if there is a winner
    saveGame({"state": getBoard()});
    resetBoard();
  };

  if ( (fullBoard( getBoard() )) === true && (checkWinner() === false)) { // check to see if the board is full
    setMessage('Tie game.');
    saveGame({"state": getBoard()});
    resetBoard();
  };



};
