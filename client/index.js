import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const url = window.location.origin;
let socket = io.connect(url);



let myTurn = true;
let symbol;

let firstmark;
let secondmark;
let gamestatus;

let count = 0;

let board = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];




// erej u koji cu pushat dva ajdija ako je length tog ereja 2 znam da imam dva plejera i pokreni igru ako nije onda je na diejblu

let step = 1;

//ne imati select ijdida nego napravit container i sve to napravit u lupu a ne zasebno

let tableCont = document.getElementById("tablecont")
let gameStatusPlace = document.getElementById('gamestatus')
let table = document.createElement('table')

let playagain = document.getElementById('playAgain')
let buttons = document.getElementsByClassName('cellButton')

let firstSymbol = document.querySelector('.firstSymbolContainer')
let symbolX = document.getElementById('firstSymbol-X')
let symbolO = document.getElementById('firstSymbol-O')

//spojiti tic tac toe na internet i napravit mogucnost multiplayer-a vjerovatno ce biti 
// dva ajdija i samo assignam svaki symbol jednom il drugom ajdiju jedan ce imat jednu mogucnost drugi drugu.

//Functions to handle game.

// vjerovatno samo saljem sa client sajda na isti endpoint ko i na serveru npr ako mi je ovdje url origin na srvu saljem stvari sa clienta na server

window.addEventListener('load', () => { drawBoard(); } )

playagain.addEventListener('click', () => { reset(); })

firstSymbol.addEventListener('click', (e) => {

	e.target.disabled = true;

})



//Function to check user input. Inside DOM table searching for button to click.
//Adding symbol behaviour.

table.addEventListener('click', (event) => {

  const isButton = event.target.nodeName === 'BUTTON';
  
  if (!isButton) {
    return;
  }
 
  makeMove(event);
  count ++;
})



socket.on("game.begin", function(data) {


	symbol = data.symbol;
	myTurn = symbol == "X";
	gameStatusPlace.innerHTML = data.symbol;


});

function makeMove(event) {

	if(symbol == undefined) {
		return;
	}


    socket.emit("make.move", { // Valid move (on client side) -> emit to server
        symbol:symbol,
        position:event.target.id
    });

}

socket.on("move.made", function(data) {

	let activeButton = document.getElementById(data.position)

	activeButton.innerHTML = data.symbol;
	activeButton.disabled = true;

	 for(let i = 0 ; i < board.length ; i++){
  	 for(let k = 0 ; k < board[i].length ; k++){
  		if(data.position == board[i][k]) {	
  			board[i][k] = data.symbol;
  		}
	}}



	console.log(board)
	
	myTurn = data.symbol !== symbol;

	if(!myTurn) {
		gameStatusPlace.innerHTML = "Your oponent turn"
		for(let i = 0 ; i < buttons.length ; i++) {
			buttons[i].disabled = true;
		}
	} else {
		gameStatusPlace.innerHTML = "Your turn"
		for(let i = 0 ; i < buttons.length ; i++) {
			buttons[i].disabled = false;
		}
	}

	checkWin(data);
});

// Bind on event for opponent leaving the game


//Function to check win.

function checkWin (data) {	


	if(board[0][0] == data.symbol && board[0][1] == data.symbol && board[0][2] == data.symbol ) {
		gamestatus = "WIN"
	} else if (board[0][0] == data.symbol && board[1][0] == data.symbol && board[2][0] == data.symbol){
		gamestatus = "WIN"
	} else if (board[1][0] == data.symbol && board[1][1] == data.symbol && board[1][2] == data.symbol){
		gamestatus = "WIN"
	} else if (board[2][0] == data.symbol && board[2][1] == data.symbol && board[2][2] == data.symbol){
		gamestatus = "WIN"
	} else if (board[0][1] == data.symbol && board[1][1] == data.symbol && board[2][1] == data.symbol){
		gamestatus = "WIN"
	} else if (board[0][2] == data.symbol && board[1][2] == data.symbol && board[2][2] == data.symbol){
		gamestatus = "WIN"
	} else if (board[0][0] == data.symbol && board[1][1] == data.symbol && board[2][2] == data.symbol){
		gamestatus = "WIN"
	} else if (board[0][2] == data.symbol && board[1][1] == data.symbol && board[2][0] == data.symbol){
		gamestatus = "WIN"
	}


	if (gamestatus == "WIN") {
		gameStatusPlace.innerHTML = `${data.symbol} WON !`
		gameStatusPlace.style.color = "#2f9e44"

		//skuziti kako disable bez funkcije ovdje.
		count = 0;
		disableButtons();

	} 
}

//Function to draw the board on start. Creating Table with DOM appending buttons inside it to click in game.

function drawBoard () {

	playagain.disabled = true;
	
	tablecont.appendChild(table)
for(let i = 0 ; i < board.length ; i++){
	let row = document.createElement('tr')
	table.appendChild(row)
	for(let k = 0 ; k < board[i].length ; k++){
		let cell = document.createElement('td')
		let button = document.createElement('button')
		button.innerHTML = "";
		button.value = board[i][k];
		button.style.height = "75px"
		button.id = board[i][k];
		button.className = "cellButton"
		cell.className = "eachCell"
		button.style.width = "75px"
		button.style.backgroundColor ="#343a40"
		button.style.color="white"
		button.style.margin = "20px 40px 20px 20px"
		button.style.fontSize = "20px"
		cell.style.borderBottom = "thick solid white"
		row.appendChild(cell)
		cell.appendChild(button)
	}
}}



// Function to disable the buttons after game.

function disableButtons () {

	for(let i = 0 ; i < buttons.length ; i++){
		buttons[i].disabled = true;
	}

	symbolX.disabled = true;
	symbolO.disabled = true;
	playagain.disabled = false;

}




//Function to reset board and enable buttons.
function reset () {

 	gamestatus = "";
 	gameStatusPlace.innerHTML = gamestatus;

	step = 0;

	firstmark = undefined;
	secondmark= undefined;

	symbolX.disabled = false;
	symbolO.disabled = false;
	
	for(let i = 0 ; i < buttons.length ; i++) {
		buttons[i].innerHTML = "";
		buttons[i].value = i + 1;
		buttons[i].disabled = false;
	}

	for(let i = 0 ; i < board.length ; i++) {
		for(let k = 0 ; k < board[i].length ; k++) { 
			count++
			board[i][k] = count;
		}}
}

