// Code your JavaScript / jQuery solution here
$( document ).ready(function() {
  attachListeners();
});//end document.ready


var turn = 0;
var board_full = false;
var message = "";

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




function attachListeners(){
  $( "td" ).click(function() {

    if ((this.innerHTML.trim() == '') && checkWinner() === false) {
      doTurn(this); //if the square is empty and there is no winner then call doTurn
      //should there also be a check for fullBoard
      //do you have to reset checkWinner() after a game is won
    };
  });

};



//Accepts a string and adds it to the div#message element in the DOM.
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
  if (board_array.some(checkforEmpty)) { //if there are any empty spaces, board is not full
   board_full = false;
 } else {
   board_full = true;
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
  var winner = "";
  var test_array = [];
  var board_array = getBoard();

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
    //reset the board
  }else if (fullBoard(board_array) === true) {
    message = "Tie game.";
  };

  setMessage(message);
  return answer;
}//end checkWinner

function resetBoard(){
  var squares = $('td').get()
  squares.forEach(function(element){
    element.innerHTML = ''; //has to match checkforEmpty innerText
  });
  turn = 0;
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

  if ( checkWinner() === true ) { // check to see if there is a winner
    resetBoard();
    message = "";
  };

  var board_array = getBoard();
  if (fullBoard(board_array) === true) { // check to see if the board is full
    resetBoard();
    message = "";
  };

  console.log(turn);
};
