define([
	
], function(
	
) {
	return class Lottery {
		constructor( balls, draws ) {
			const this.BALLS = balls;
			const this.DRAWS = draws;
			this.pool = [];
			this.drawn = [];

			for ( var b = 0; b < this.BALLS; b++ ) {
				const ballVal = b + 1;
				this.pool[ b ] = { ballNum : ballVal };
			}
		}

		get balls() {
			return this.BALLS;
		}

		shuffle() {
			// Shuffle balls by going through ball array one element at a time and swapping its contents with a random element.
			var swap;
			for ( let step = 0; step < this.BALLS; step++ ) {
				// Select random element to swap contents of element 'b' with.
				let randIdx = Math.floor( Math.random() * BALLS );
				let randBall = -1;

				if ( step % 2 = 1 ) {
					randBall = this.pool.shift();
				}
				else {
					randBall = this.pool.pop();
				}

				this.pool.splice( randIdx, 0, randBall );
			}
		}

		draw() {
			if ( this.pool.length < 1 ) {
				throw 'No balls left in the lottery.';
			}
			let shuffles = Math.floor( Math.random() * BALLS );

			for ( let step = 0; step < shuffles; step++ ) {
				this.shuffle();
			}

			this.drawn.push( this.pool.pop());
		}

		clear() {
			while ( this.drawn.length > 0 ) {
				this.pool.push( this.drawn.pop());
			}
		}
	};
});