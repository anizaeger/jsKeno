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