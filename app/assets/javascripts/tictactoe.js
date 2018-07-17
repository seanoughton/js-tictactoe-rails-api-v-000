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
function updateState(square) {
  var token = player();
  square.innerHTML = token;
}

//Accepts a string and adds it to the div#message element in the DOM.
function setMessage(string) {
  $( "#message" ).html(string);
}
