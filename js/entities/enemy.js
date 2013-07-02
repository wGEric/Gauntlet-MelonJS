game.EnemyEntity = me.ObjectEntity.extend({

	init: function( x, y, settings ) {
		settings.image = 'entities';
		settings.spritewidth = 32;
		settings.spriteheight = 32;

		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(2, 2);

		this.renderable.addAnimation( 'walkUp', [ 140, 148, 140, 156 ] );
		this.renderable.addAnimation( 'walkUpRight', [ 141, 149, 141, 157 ] );
		this.renderable.addAnimation( 'walkRight', [ 142, 150, 142, 158 ] );
		this.renderable.addAnimation( 'walkDownRight', [ 143, 151, 143, 159 ] );
		this.renderable.addAnimation( 'walkDown', [ 144, 152, 144, 160 ] );
		this.renderable.addAnimation( 'walkDownLeft', [ 145, 153, 145, 161 ] );
		this.renderable.addAnimation( 'walkLeft', [ 146, 154, 146, 162 ] );
		this.renderable.addAnimation( 'walkUpLeft', [ 147, 155, 147, 163 ] );
		this.renderable.addAnimation( 'explode', [ 328, 329, 330, 331, 332, 333 ] );
		this.renderable.setCurrentAnimation( 'walkUp' );

		// make it collidable
        this.collidable = true;

        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

		this.player = me.game.getEntityByName( 'mainPlayer' )[0];

		// this.tile = {
		// 	x: null,
		// 	y: null
		// };
	},

	update: function() {
		if ( ! this.inViewport ) {
			return false;
		}

		if ( ! this.alive ) {
			this.parent();
			return true;
		}


		var x = this.pos.x,
			y = this.pos.y,
			px = this.player.pos.x,
			py = this.player.pos.y;

		// left/right movement
		if ( x > px ) {
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if ( x < px ) {
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}

		// up/down movement
		if ( y > py ) {
			this.vel.y -= this.accel.y * me.timer.tick;
		} else if ( y < py ) {
			this.vel.y += this.accel.y * me.timer.tick;
		} else {
			this.vel.y = 0;
		}

		// This isn't working to prevent monsters from
		// bouncing back and forth when it is moving
		// beyond the player. It is late and I can't think
		// of the logic behind it.
		//
		// var diffx = ( this.vel.x + x ) - px;
		// if ( diffx < this.vel.x ) {
		// 	this.vel.x = diffx;
		// }

		// var diffy = ( this.vel.y + y ) - py);
		// if ( diffy < this.vel.y ) {
		// 	this.vel.y = diffy;
		// }

		var results = me.game.collide(this, true),
			res;

		if ( results.length > 0 ) {
			for( var i = 0; i < results.length; i++ ) {
				res = results[i];

		        // if we collide with an enemy
		        if ( res.obj.type == me.game.ENEMY_OBJECT && res.obj.alive ) {
		        	if ( ( res.x > 0 && this.vel.x > 0 ) || ( res.x < 0 && this.vel.x < 0 ) ) {
		        		this.vel.x = 0;
		        	}

		        	if ( ( res.y > 0 && this.vel.y > 0 ) || ( res.y < 0 && this.vel.y < 0 ) ) {
		        		this.vel.y = 0;
		        	}
		        }
		    }
       	}

		this.updateMovement();

		// update animation if necessary
		if ( this.vel.x !== 0 || this.vel.y !== 0 ) {

			// set the correct animation
			if ( this.vel.x < 0 && this.vel.y === 0 ) {
				this.renderable.setCurrentAnimation( 'walkLeft' );
			} else if ( this.vel.x > 0 && this.vel.y === 0 ) {
				this.renderable.setCurrentAnimation( 'walkRight' );
			} else if ( this.vel.x === 0 && this.vel.y > 0 ) {
				this.renderable.setCurrentAnimation( 'walkDown' );
			} else if ( this.vel.x === 0 && this.vel.y < 0 ) {
				this.renderable.setCurrentAnimation( 'walkUp' );
			} else if ( this.vel.x > 0 && this.vel.y > 0 ) {
				this.renderable.setCurrentAnimation( 'walkDownRight' );
			} else if ( this.vel.x > 0 && this.vel.y < 0 ) {
				this.renderable.setCurrentAnimation( 'walkUpRight' );
			} else if ( this.vel.x < 0 && this.vel.y > 0 ) {
				this.renderable.setCurrentAnimation( 'walkDownLeft' );
			} else if ( this.vel.x < 0 && this.vel.y < 0 ) {
				this.renderable.setCurrentAnimation( 'walkUpLeft' );
			}

			// update object animation
			this.parent();
			return true;
		}

		// else inform the engine we did not perform
		// any update (e.g. position, animation)
		return false;
	}

});
