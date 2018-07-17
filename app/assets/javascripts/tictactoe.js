// Code your JavaScript / jQuery solution here
$( document ).ready(function() {

});//end document.ready

var turn = 1;

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

//Returns the token of the player whose turn it is, 'X' when the turn variable is even and 'O' when it is odd.
function player() {
  var player = ""
  if ((turn % 2) === 0) {
    player = "X"}
  else {
      player = "O"
    }
  return player;
};

//Invokes player() and adds the returned string ('X' or 'O') to the clicked square on the game board.
function updateState(square) {
  var token = player();
  square.innerHTML = token;
}

//Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  $( "#message" ).html(string);
}

//Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
//If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!'
function checkWinner() {
  //has to get the current state of the board
  //iterate through board using jquery to grab the html inside each td and create an array of those values
  //compare the board array to the winning combinations



  var message = "Player ${winner} Won!"
  setMessage(message);
  return // true or false, depending on who won
}
