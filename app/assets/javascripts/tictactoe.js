// Code your JavaScript / jQuery solution here
$( document ).ready(function() {

});//end document.ready

var turn = 1;

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
//window.updateState(squares[8]); window.updateState(squares[0]); squares is an array of table data, indexed 0-8
function updateState(square) {
  var token = player();
  square.innerHTML = token;
  //add innerHTML of the token to the appropriate td
}
