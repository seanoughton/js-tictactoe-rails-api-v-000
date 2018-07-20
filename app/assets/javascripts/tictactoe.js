// Code your JavaScript / jQuery solution here
$( document ).ready(function() {
  attachListeners();
});//end document.ready

/// SET Variables
var turn = 0;
var board_full = false;
var message = "";
var winner = "";
var gameSaved = false;
var gameId = 0;

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
    if ((this.innerHTML.trim() == '') && checkWinner() === false) {
      doTurn(this);
    };
  });

  //// Click function to previous button that loads all the previous games as buttons into the DOM
  $("#previous").click(function() {
    $("#games").empty(); // clear the div so that only new games are loaded
    $.get("/games", function(response) {
        var games_string = ``;
        var games_array = response.data;
        $.each(games_array, function(i, item) {
            games_string += `<button id="${item.id}">${item.id}</button>`;
        });
        $("#games").append(games_string);
    });
  });

/// Click function that saves or updates the game
  $("#save").click(function() {
    if (gameSaved === false) {
      saveGame();
    };

    if (gameSaved === true) { //update the game if it was previously saved
      updateGame();
    }

  });// end save /update

  /// Clears the game board if clear button is clicked
  $("#clear").click(function() {
    if (gameSaved === true) {
      resetBoard();
      turn = 0;
      gameSaved = false;
    };
    if (gameSaved === false) {
      resetBoard();
      turn = 0;
    };
  });

/// loads the previous games if the saved games buttons are clicked
  /// has to be able to grab the buttons that were added after the DOM was loaded
  $(document).on('click', '#games :button', function(){
      $.get(`/games/${this.id}`, function(response) {
        var savedBoard = response.data.attributes.state;
        var squares = $('td').get()
        $.each(squares, function( index, value ) {
          savedValue = savedBoard[index];
          value.innerHTML= savedValue;
        });

        boardCount = 0;
        $.each(savedBoard, function( index, value ){
          if (value === 'X' || value === 'Y'){
            boardCount += 1;
          }
        });
        turn = boardCount+1;
        gameSaved = true;
      });
  });

};
/////////////////////// end listeners

///// HELPER METHODS

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

function fullBoard(board_array){
  if ( board_array.includes('') || board_array.includes(' ')) {
   board_full = false;
 } else {
   board_full = true;
   message = "Tie game.";
 }
 return board_full;
}

function getBoard(){
  var board = $("td").get();
  return board.map(square => square.innerHTML); //returns an array of board values, the "X"'s and "O"'s
}

function resetBoard(){
  var squares = $('td').get()
  squares.forEach(function(element){
    element.innerHTML = '';
  });
}


function checkWinner() {
  var answer = false;
  var test_array = [];
  var board_array = getBoard();
  message = "";

  WIN_COMBINATIONS.forEach(function(combo){ //returns array of winning combinations, ex. [0,1,2]
    combo.forEach(function(index){
      test_array.push(board_array[index]) //push in the value at that index either "X","Y", or ""
    });
    if (test_array.every(checkForX)) {
     answer = true;
     winner = "X"
   } else if (test_array.every(checkForO)) {
      answer = true;
      winner = "O"
    };
    test_array = [];
  });

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
  var player = "O";
  if ( isEven(turn) ) { //if the turn is an even number, player is X
    player = "X"
  };
  return player;
};

function updateState(square) {
  var token = player();
  square.innerHTML = token;
}

function doTurn(square) {
  updateState(square); // add X or O to the board
  turn += 1;

  if ( checkWinner() === true ) { // check to see if there is a winner
    turn = 0;
    saveGame({"state": getBoard()});
    resetBoard();
  };

  if ( (fullBoard( getBoard() )) === true && (checkWinner() === false)) { // check to see if the board is full
    setMessage('Tie game.');
    saveGame({"state": getBoard()});
    resetBoard();
    turn = 0;
  };



};
