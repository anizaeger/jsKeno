/**
 *
 * @source: https://github.com/anizaeger/jsKeno
 *
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 *
 * Copyright (C) 2016 Anakin-Marc Zaeger
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 *
 * @licend The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

function gplAlert() {
	var copyText = "";
	copyText += "Copyright (C) 2016 Anakin-Marc Zaeger\n"
	copyText += "\n"
	copyText += "\n"
	copyText += "The JavaScript code in this page is free software: you can\n"
	copyText += "redistribute it and/or modify it under the terms of the GNU\n"
	copyText += "General Public License (GNU GPL) as published by the Free Software\n"
	copyText += "Foundation, either version 3 of the License, or (at your option)\n"
	copyText += "any later version.  The code is distributed WITHOUT ANY WARRANTY;\n"
	copyText += "without even the implied warranty of MERCHANTABILITY or FITNESS\n"
	copyText += "FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.\n"
	copyText += "\n"
	copyText += "As additional permission under GNU GPL version 3 section 7, you\n"
	copyText += "may distribute non-source (e.g., minimized or compacted) forms of\n"
	copyText += "that code without the copy of the GNU GPL normally required by\n"
	copyText += "section 4, provided you include this license notice and a URL\n"
	copyText += "through which recipients can access the Corresponding Source.\n"
	window.alert(copyText)
}

var BALLS = 80;
var DRAWS = 20;

var maxSpots = 10;		// Maximum number of playable spots [Default: 10]
var betLimit = 5;		// Maximum bet per game [Default: 5]
var houseEdge = 30;		// House edge for payout compared to true odds.  Payout calculated from odds will be reduced by this percentage [Default: 30]
var maxPayout = 100000;		// Maximum payout per game [Default: 100000]
var credits = 0;

var spots;	// Number of spots 
var hits;	// Number of hits
var card = new Array( BALLS );	// Array representing the 80 numbers on a keno ticket.  Element valye: picked spot (1 representing a picked number on a player's ticket)
var board = new Array( BALLS );	// Array representing the 80 spaces on a keno gameboard.  Element value: drawn state (1 representing a drawn ball)
var pool = new Array( BALLS );	// Array representing the 80 keno balls.  Element value: ball number
var drawn = new Array( DRAWS );	// Array representing the 20 balls drawn during a keno game

var combos;
var spotCombos = new Array( DRAWS + 1);
var pcntOdds = new Array( DRAWS + 1);
var payout = new Array( DRAWS + 1);
var gameOver;

function init() {
	spots = 0;
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
	clearPaytable();
	endGame();
	document.getElementById("spots").value=spots;
	document.getElementById("betAmt").value=betAmt;
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
			boardTxt += '<tr><td colspan=10 align="center" ><div id="messageBoard"></div></td></tr>'
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
	if ( payout[hits] > 0 ) {
		setTimeout(function() {
			document.getElementById('p' + hits + 'c1').innerHTML="-->"
			document.getElementById('p' + hits + 'c2').innerHTML="<--"
			payWin();
		},150 )
	} else {
		endGame();
	}
}

function payWin() {
	credits += payout[hits];
	document.getElementById("credits").value=credits;
}

/*
function payWin(wintype,payout,i,paySound) {
	var loopTime;
	document.getElementById("win").value=payout;
	
	if (payout >= 300) {
		loopTime = 25;
	} else {
		loopTime = 100;
	}
	if ( wintype == 0 && betAmt == maxLineBet) {
		jackpot(0);
		return;
	} else {
		if ( loopTime == 25 ) {
			if ( i % 4 == 0 ) {
				playSound("paySound" + paySound);
				paySound++;
			}
		} else {
			playSound("paySound" + paySound);
			paySound++;
		}
		if (paySound == paySounds ) { paySound = 0; }
	}
	
	i++;
	credits++
	setCookie("credits",credits,expiry);
	document.getElementById("paid").value=i;
	document.getElementById("credits").value=credits;
	payStats(-1);

	if ( dbgRapid == 1 ) {
		loopTime = 0;
	}

	setTimeout(function () {
		if (i < payout) {
			payWin(wintype,payout,i,paySound);
		} else {
			document.getElementById("wintype").innerHTML="<marquee>"+paytable[wintype][4]+"</marquee>";
			endGame();
		}
	}, loopTime);
}
*/

function endGame() {
	betAmt = 0;
	gameOver = 1;
	document.getElementById("messageBoard").innerHTML="Game Over - Play " + betLimit + " Credits";
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
	if ( gameOver == 1 ) {
		return;
	}
	for ( n = 0; n < BALLS; n++ ) {
		card[n] = 0;
		document.getElementById("n"+n).style.backgroundImage="none";
		document.getElementById("n"+n).style.color="black";
	}
	spots = 0;
	clearOdds();
}

function pickNum(num) {
	if ( betAmt <= 0 ) {
		betAmt = 0;
		return;
	}
	if ( card[num] == 1 ) {
		daubCell(num,0,0);
	} else {
		if ( spots < maxSpots) { daubCell(num,1,0); }
	}
	calcOdds();
	if ( spots == 0 ) {
		clearPaytable();
	} else {
		printPaytable();
	}
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
		daubCell(qp,1,1);
	}
	calcOdds();
}

function qpPrompt() {
	var qp = parseInt(prompt('Number of Quick Pick spots:'));
	return qp;
}

function daubCell(num,daub,qp) {
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
	if ( qp != 1 ) {
		var snd = new Audio("sounds/tick.wav");
		snd.play();
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

/*
	Credit related functions
*/

function insertCoin() {
	return;
}

function insertBill() {
	return;
}

function cashOut() {
	clearBoard();
}

function betOne() {
	if ( betAmt < betLimit ) {
		gameOver = 0;
		document.getElementById("qpBtn").disabled=false;
		document.getElementById("spots").value=spots;
		document.getElementById("messageBoard").innerHTML="&nbsp;";
		clearBoard();
		var snd = new Audio("sounds/coinBong.wav");
		snd.play();
		betAmt++;
		document.getElementById("betAmt").value=betAmt;
		calcPay();
	}
}

function betMax() {
	if ( betAmt >= betLimit || credits <= 0) {
		return;
	} else {
		betOne();
	}
	setTimeout(function () {
		betMax();
	}, 125 )
}

/*
 * Paytable calculation
 */

function factorial(num) {
	var factor = 1;
	for ( x = num; x > 1; x-- ) {
		factor *= x
	}
	return factor;
}
function combin(total,part) {
	var combos;
	var num = factorial(total);
	var denom = factorial(part) * factorial(total-part)
	combos = num / denom;
	return combos;
}
function kenoProbs(balls,drawn,spots) {
	var odds;
	var undrawn = balls - drawn;
	odds = Math.round(combin(drawn,s)*combin(undrawn,spots-s));
	return odds;
}

function calcOdds() {
	var combos = 0;
	for ( s = 0; s <= spots; s++ ) {
		spotCombos[s] = kenoProbs(BALLS,DRAWS,spots);
		combos += spotCombos[s]
	}
	for ( p = 0; p <= spots; p++ ) {
		pcntOdds[p] = ( spotCombos[p] / combos );
	}
	calcPay();
}

function calcPay() {
	if ( spots == 0 ) {
		payout[0] = 0;
	} else {
		if ( spots == 2 ) {
			minHits = 2;
		} else {
			minHits = Math.round( spots / 2 );
		}
		for ( p = 0; p <= spots; p++ ) {
			if ( p < minHits && pcntOdds[p] > pcntOdds[minHits] ) {
				payout[p] = 0;
			} else {
				payout[p] = Math.round( ( ( 100 - houseEdge ) / 100 ) / ( pcntOdds[p] ) ) * betAmt;
				if ( payout[p] > maxPayout ) {
					payout[p] = maxPayout;
				}
			}
		}
	}
	printPaytable();
}

function printPaytable() {
	var payTxt = '';
	document.getElementById("paytable").innerHTML=payTxt;
	payTxt='<tr><td width=10%></td><td width=10%>Spots</td><td>Payout</td><td></td width=10%><td width=100% /></tr>';
	for (s = 0; s <= spots; s++) {
		
		payTxt += '<tr><td id="p' + s + 'c' + 1 + '"></td><td>' + s + '</td><td>' + payout[s] + '</td><td id="p' + s + 'c' + 2 + '"></td><td /></tr>';
	}
	document.getElementById("paytable").innerHTML=payTxt;
}

function clearOdds() {
	for ( s = 0; s <= DRAWS; s++ ) {
		spotCombos[s] = 0;
		pcntOdds[s] = 0;
		payout[s] = 0;
		clearPaytable();
	}
}

function clearPaytable() {
	var payTxt = '<tr><td width=10%>Spots</td><td>Payout</td><td /></tr>';
	payTxt += '<tr><td>0</td><td>0</td></tr>';
	document.getElementById("paytable").innerHTML=payTxt;
}

/*
	SoundJS Functions
*/

// Placeholder for future SoundJS functions


/*
	jQuery Functions
*/

// Placeholder for future SoundJS functions