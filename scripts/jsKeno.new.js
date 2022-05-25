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

function get( name ) {
	var BALLS = 80;
	var DRAWS = 20;
	var UNDRAWN  = BALLS - DRAWS;
	return eval(name);
}

class Machine {
	constructor( balls, draws ) {
		this.gameboard();
		this.drawboard();

		this.lottery = new Lottery( balls, draws );
		this.board = new Board( balls );
		this.card = new Card( balls );
	}

	gameboard() {
		var boardTxt = "";
		for ( var row = 0; row < 8; row++ ) {
			boardTxt += '<tr>';
			for ( var col = 0; col < 10; col++ ) {
				var cell = ( row * 10 ) + col;
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

	drawboard() {
		var drawnTxt=""
		for ( var row = 0; row < 10; row++) {
			drawnTxt += '<tr>';
			for ( var col = 0; col < 2; col++) {
				var cell = ( row * 2 ) + col;
				drawnTxt += '<td><div class="cell" id="d'+cell+'"></div></td>'
			}
			drawnTxt += '<tr>';
		}
		document.getElementById("draws").innerHTML=drawnTxt;
	}
};

class Lottery{
	constructor( balls, draws ) {
		this.BALLS = balls;
		this.DRAWS = draws;
		this.pool = [];
		this.drawn = [];

		for ( var b = 0; b < this.BALLS; b++ ) {
			this.pool[ b ] = b + 1;
		}
	}

	shuffle() {
		// Shuffle balls by going through ball array one element at a time and swapping its contents with a random element.
		var swap;
		for ( var b = 0; b < this.BALLS; b++ ) {
			// Select random element to swap contents of element 'b' with.
			var randBall = Math.floor(Math.random() * BALLS);
			swap = pool[ b ];
			this.pool[ b ] = this.pool[ randBall ];
			this.pool[ randBall ] = swap;
		}
	}

	draw() {
		for ( var d = 0; d < this.DRAWS; d++ ) {	// Loop through first 20 balls/elements of ball array and copy them to the corresponding drawn balls (rabbit ear) array
			this.drawn[ d ] = this.pool[ d ];
		}
	}

	clear() {
		for ( var d = 0; d < this.DRAWS; d++ ) {
			this.drawn[ d ] = 0;
		}
	}
};

class Board {
	constructor( balls ) {
		this.BALLS = balls;
		this.board = [];

		this.clear();
	}

	clear() {
		for ( var b = 0; b < this.BALLS; b++ ) {
			this.board[ b ] = 0;
		}
	}
};

class Card {
	constructor( balls ) {
		this.BALLS = balls;
		this.card = [];

		this.clear()
	}

	clear() {
		for ( var b = 0; b < this.BALLS; b++ ) {
			this.card[ b ] = 0;
		}
	}
};

function init() {
	var machine = new Machine( get( 'BALLS' ), get( 'DRAWS' ));
}