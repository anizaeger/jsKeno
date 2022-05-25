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