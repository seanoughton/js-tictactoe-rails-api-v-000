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


////////////////////////////////////////////////////////////////

function attachListeners(){
  $( "td" ).click(function() {
    if ((this.innerHTML.trim() == '') && checkWinner() === false) {
      doTurn(this);
    };
  });

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

  $("#save").click(function() {
    //{state: ["X", "O", "X", "", "O", "O", "", "", "X"]}

    var value = {"state": getBoard()};
    if (gameSaved === false) {
      saveGame(value);

      //$.post('/games', value).done(function(data) {
        //var game = data;
        //gameId = game.data.id;
        //gameSaved = true;
      //});
    };

    if (gameSaved === true) {
      $.ajax({
        url: `/games/${gameId}`,
        type: 'PATCH',
        data: value
      });
    }

  });// end save /update

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

  $("#clear").click(function() {
    console.log("clicked saved game")
  };

};
/////////////////////// end listeners

///// HELPER METHODS

function saveGame(value) {
  $.post('/games', value).done(function(data) {
    var game = data;
    gameId = game.data.id;
    gameSaved = true;
  });
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
  //const board_array = board.map(square => square.innerHTML);
  return board.map(square => square.innerHTML); //returns an array of board values, the "X"'s and "O"'s
}



function checkWinner() {
  var answer = false; //this will be the return value True = there is a winner, False = no winner
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

function resetBoard(){
  var squares = $('td').get()
  squares.forEach(function(element){
    element.innerHTML = ''; //has to match checkforEmpty innerText
  });
}

//Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.

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

//Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(square) {
  var token = player();
  square.innerHTML = token;
}

function doTurn(square) {
  updateState(square); // add X or O to the board
  turn += 1; // increment the turn count
  var value = {"state": getBoard()};

  if ( checkWinner() === true ) { // check to see if there is a winner
    turn = 0;
    saveGame(value);
    resetBoard();
  };

  var board_array = getBoard();
  if ( (fullBoard(board_array)) === true && (checkWinner() === false)) { // check to see if the board is full
    setMessage('Tie game.');
    saveGame(value);
    resetBoard();
    turn = 0;
  };





};
