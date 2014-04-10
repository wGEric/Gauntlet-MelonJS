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

    this.alive = true;

    // make it collidable
    this.collidable = true;

    // make it a enemy object
    this.type = me.game.ENEMY_OBJECT;

    this.player = me.game.world.getChildByName( 'mainPlayer' )[0];

    // this.tile = {
    //  x: null,
    //  y: null
    // };
  },

  update: function(dt) {
    if ( ! this.alive ) {
      this.parent(dt);
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

    var results = me.game.world.collide(this, true),
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
        } else if ( res.obj.type == 'bullet' && this.alive ) {
          this.alive = false;
          this.collidable = false;
          this.vel.x = 0;
          this.vel.y = 0;

          res.obj.removeBullet();

          if (!this.renderable.isCurrentAnimation('explode')) {
            this.renderable.setCurrentAnimation( 'explode', (function() {
              me.game.world.removeChild( this );
              me.game.world.sort();
            }).bind(this) );
          }

        }
      }
    }

    var curAnimation;
    if ( this.vel.x < 0 && this.vel.y === 0 ) {
      curAnimation = 'walkLeft';
    } else if ( this.vel.x > 0 && this.vel.y === 0 ) {
      curAnimation = 'walkRight';
    } else if ( this.vel.x === 0 && this.vel.y > 0 ) {
      curAnimation = 'walkDown';
    } else if ( this.vel.x === 0 && this.vel.y < 0 ) {
      curAnimation = 'walkUp';
    } else if ( this.vel.x > 0 && this.vel.y > 0 ) {
      curAnimation = 'walkDownRight';
    } else if ( this.vel.x > 0 && this.vel.y < 0 ) {
      curAnimation = 'walkUpRight';
    } else if ( this.vel.x < 0 && this.vel.y > 0 ) {
      curAnimation = 'walkDownLeft';
    } else if ( this.vel.x < 0 && this.vel.y < 0 ) {
      curAnimation = 'walkUpLeft';
    }

    if (curAnimation && !this.renderable.isCurrentAnimation(curAnimation)) {
      this.renderable.setCurrentAnimation(curAnimation);
    }

    this.updateMovement();

    // update animation if necessary
    if ( this.vel.x !== 0 || this.vel.y !== 0 ) {
      // update object animation
      this.parent(dt);
      return true;
    }

    // else inform the engine we did not perform
    // any update (e.g. position, animation)
    this.parent(dt);
    return true;
  }

});
