game.BulletEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		settings.image = 'entities';
		settings.spritewidth = 32;
		settings.spriteheight = 32;

		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(5, 5);

		// set the animation
		this.renderable.addAnimation( 'shoot', [ 24, 25, 26, 27, 28, 29, 30, 31 ] );
		this.renderable.addAnimation( 'shootLeft', [ 24, 31, 30, 29, 28, 27, 26, 25 ] );
		this.renderable.addAnimation( 'explode', [ 334 ] );
		this.renderable.setCurrentAnimation( 'shoot' );

		this.alwaysUpdate = true;

		this.direction = settings.direction.replace('walk', '').toLowerCase();
	},

	update: function() {
		// up/down movement
		if ( this.direction.indexOf( 'up' ) !== -1 ) {
			this.vel.y -= this.accel.y * me.timer.tick;
		} else if ( this.direction.indexOf( 'down' ) !== -1 ) {
			this.vel.y += this.accel.y * me.timer.tick;
		} else {
			this.vel.y = 0;
		}

		// left/right movement
		if ( this.direction.indexOf( 'left' ) !== -1 ) {
			this.vel.x -= this.accel.x * me.timer.tick;
		} else if ( this.direction.indexOf( 'right' ) !== -1 ) {
			this.vel.x += this.accel.x * me.timer.tick;
		} else {
			this.vel.x = 0;
		}

		if ( this.vel.x < 0 || ( this.vel.x === 0 && this.vel.y < 0 ) ) {
			this.renderable.setCurrentAnimation( 'shootLeft' );
		} else {
			this.renderable.setCurrentAnimation( 'shoot' );
		}

		// check & update movement
		var envRes = this.updateMovement();
		var res = me.game.collide(this);

		// remove if it hits a wall or goes off screen
		if ( envRes.xtile || envRes.ytile || ! this.inViewport ) {

			if ( ! this.inViewport ) {
				this.removeBullet();
			} else {
				this.renderable.setCurrentAnimation( 'explode', (function () {
					this.removeBullet();
					return false; // do not reset to first frame
				}).bind(this) );
			}

			// update object animation
			this.parent();
			return true;
		}

		if ( res ) {
	        // if we collide with an enemy
	        if ( res.obj.type == me.game.ENEMY_OBJECT && res.obj.alive ) {
	        	res.obj.alive = false;
	        	res.obj.collidable = false;
	        	res.obj.renderable.setCurrentAnimation( 'explode', function() {
	        		me.game.remove( res.obj );
	        		me.game.sort();
	        	} );

	        	this.removeBullet();

	        	this.parent();
	        	return true;
        	}
        }

		if ( this.vel.x !== 0 || this.vel.y !== 0 ) {
			// update object animation
			this.parent();
			return true;
		}

		// else inform the engine we did not perform
		// any update (e.g. position, animation)
		return false;
	},

	removeBullet: function() {
		me.game.remove( this );
		me.game.sort();
	}
});
