var BALLS = 80;
var DRAWS = 20;

var maxSpots = 10;
var maxBet = 5;
var houseEdge = 25;	// House edge for payout compared to true odds.

var spots;	// Number of spots 
var hits;	// Number of hits
var card = new Array( BALLS );	// Array representing the 80 numbers on a keno ticket.  Element valye: picked spot (1 representing a picked number on a player's ticket)
var board = new Array( BALLS );	// Array representing the 80 spaces on a keno gameboard.  Element value: drawn state (1 representing a drawn ball)
var pool = new Array( BALLS );	// Array representing the 80 keno balls.  Element value: ball number
var drawn = new Array( DRAWS );	// Array representing the 20 balls drawn during a keno game

var paytable = new Array();
paytable[1] = ["",3];
paytable[2] = ["","",15];
paytable[3] = ["","",2,46];
paytable[4] = ["","",2,5,91];
paytable[5] = ["","","",3,12,810];
paytable[6] = ["","","",3,4,70,1600];
paytable[7] = ["","","",1,2,21,400,7000];
paytable[8] = ["","","","",2,12,98,1652,10000];
paytable[9] = ["","","","",1,6,44,335,4700,10000];
paytable[10] = ["","","","","",5,24,142,1000,4500,10000];

var betAmt = 0;
var spots;

function init() {	
	// Initialize ball pool by setting array elements to numbers 1 through 80.
	for ( b = 0; b < BALLS; b++ ) {
		pool[ b ] = b + 1;
		board[ b ] = 0;
		card[ b ] = 0;
	}
	initTable();
	initDrawBoard();
	clearBoard();
	clearCard();
}

// Generate HTML table representing keno ball "rabbit ears"
function initDrawBoard() {
	var drawnTxt=""
	for ( row = 0; row < 10; row++) {
		drawnTxt += '<tr>';
		for ( col = 0; col < 2; col++) {
			cell = ( row * 2 ) + col;
			drawnTxt += '<td><div class="cell" id="d'+cell+'"></div></td>'
		}
		drawnTxt += '<tr>';
	}
	document.getElementById("draws").innerHTML=drawnTxt;
}

// Generate HTML table representing keno card/board
function initTable() {
	var boardTxt = "";
	for ( row = 0; row < 8; row++ ) {
		boardTxt += '<tr>';
		for ( col = 0; col < 10; col++ ) {
			cell = ( row * 10 ) + col;
			boardTxt += '<td>';
			boardTxt += '<div class="cell" id="n'+cell+'"onClick="pickNum('+cell+')">'+ ( cell + 1 ) +'</div>';
			boardTxt += '</td>';
		}
		boardTxt += '</tr>';
		if ( row == 3 ) {	// Generate gap/message board between upper and lower halfs of game card
			boardTxt += '<tr><td colspan=10 align="center" ><div id="messageBoard">Game Over</div></td></tr>'
		}
	}
	document.getElementById("playfield").innerHTML=boardTxt;
}

function shuffleBalls() {
	// Shuffle balls by going through ball array one element at a time and swapping its contents with a random element.
	var swap;
	for ( b = 0; b < BALLS; b++ ) {
		var randBall = Math.floor(Math.random() * BALLS);	// Select random element to swap contents of element 'b' with.
		swap = pool[ b ];
		pool[ b ] = pool[ randBall ];
		pool[ randBall ] = swap;
	}
	var c = b;
}

function drawBalls() {
	for ( d = 0; d < DRAWS; d++ ) {	// Loop through first 20 balls/elements of ball array and copy them to the corresponding drawn balls (rabbit ear) array
		drawn[ d ] = pool[ d ];
	}
}

function popDraws(dIndex) {
	var num =  drawn[ dIndex ];
	document.getElementById("d"+dIndex).innerHTML = num;
	var cell =  num - 1;
	board[ cell ] = 1;
	if ( card[ cell ] == 1) {
		var snd = new Audio("sounds/hit.wav");
		snd.play();
		hits++;
		document.getElementById("d"+dIndex).style.backgroundColor="#00ff00";
		document.getElementById("hits").value=hits;
	} else {
		var snd = new Audio("sounds/draw.wav");
		snd.play();
	}
	if ( dIndex == DRAWS - 1) {
		document.getElementById("n"+cell).style.backgroundColor="#ff00ff";
	} else {
		document.getElementById("n"+cell).style.backgroundColor="#00ffff";
	}
	dIndex++
	if ( dIndex < DRAWS ) {
		setTimeout(function() {
			popDraws(dIndex);
		},150 )
	} else {
		checkHits();
	}
}

function checkHits() {
	endGame();
}

function endGame() {
	betAmt = 0;
	document.getElementById("messageBoard").innerHTML="Game Over";
}

function clearBoard() {
	for ( d = 0; d < DRAWS; d++ ) {
		drawn[ d ] = 0;
		document.getElementById("d"+d).innerHTML = "";
		document.getElementById("d"+d).style.backgroundColor="white";
	}
	for ( n = 0; n < BALLS; n++ ) {
		board[ n ] = 0;
		document.getElementById("n"+n).style.backgroundColor="white";
	}
	hits = 0;
	document.getElementById("hits").value=hits;
}

function clearCard() {
	for ( n = 0; n < BALLS; n++ ) {
		daubCell(n,0);
	}
	spots = 0;
}

function pickNum(num) {
	if ( betAmt <= 0 ) {
		betAmt = 0;
		return;
	}
	if ( card[num] == 1 ) {
		daubCell(num,0);
	} else {
		if ( spots < maxSpots) { daubCell(num,1); }
	}
}

function calcPays() {
	minHits = Math.floor(( spots / 2 ) + 1 );
	
	// Combinations formula: 
}

function quickPick() {
	if ( betAmt <= 0 ) {
		betAmt = 0;
		return;
	}
	var qpSpots;
	do {
		var qpTest = 0;
		qpSpots = qpPrompt();
		if (isNaN(qpSpots)) {
			return;
		}
		if (qpSpots < 1 || qpSpots > maxSpots) {
			if ( !(confirm("Input must be between 1 and "+maxSpots+"."))) {
				return;
			}
		} else {
			qpTest = 1;
		}
	} while (qpTest != 1)
	clearCard();
	shuffleBalls();
	for ( var p = 0; p < qpSpots; p++ ) {
		qp = pool[ p ] - 1;
		daubCell(qp,1);
	}
}

function qpPrompt() {
	var qp = parseInt(prompt('Number of Quick Pick spots:'));
	return qp;
}

function daubCell(num,daub) {
	card[num] = daub;
	if ( daub == 1 ) {
		document.getElementById("n"+num).style.backgroundImage="url(images/brushstroke.png)";
		document.getElementById("n"+num).style.color="white";
		spots++
	} else {
		document.getElementById("n"+num).style.backgroundImage="none";
		document.getElementById("n"+num).style.color="black";
		spots--
	}
	document.getElementById("spots").value=spots;
}

function startGame() {
	if ( betAmt <= 0 || spots == 0 ) {
		return;
	}
	document.getElementById("qpBtn").disabled=true;
	shuffleBalls();
	drawBalls();
	popDraws(0);
	betAmt = 0;
}

function cashOut() {
	clearBoard();
}

function betOne() {
	document.getElementById("qpBtn").disabled=false;
	document.getElementById("spots").value=spots;
	document.getElementById("messageBoard").innerHTML="&nbsp;";
	clearBoard();
	betAmt++;
	document.getElementById("betAmt").value=betAmt;
}

function betMax() {
	
}