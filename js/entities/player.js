/*-------------------
  a player entity
  -------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({

  /* -----

     constructor

     ------ */

  init: function(x, y, settings) {
    settings.image = 'entities';
    settings.spritewidth = 32;
    settings.spriteheight = 32;

    // call the constructor
    this.parent(x, y, settings);

    // set the default horizontal & vertical speed (accel vector)
    this.setVelocity(3, 3);

    // adjust the bounding box
    // this.updateColRect(4, 26, -1, 0);

    this.renderable.addAnimation( 'walkUp', [ 0, 8, 0, 16 ] );
    this.renderable.addAnimation( 'walkUpRight', [ 1, 9, 1, 16 ] );
    this.renderable.addAnimation( 'walkRight', [ 2, 10, 2, 18 ] );
    this.renderable.addAnimation( 'walkDownRight', [ 3, 11, 3, 19 ] );
    this.renderable.addAnimation( 'walkDown', [ 4, 12, 4, 20 ] );
    this.renderable.addAnimation( 'walkDownLeft', [ 5, 13, 5, 21 ] );
    this.renderable.addAnimation( 'walkLeft', [ 6, 14, 6, 22 ] );
    this.renderable.addAnimation( 'walkUpLeft', [ 7, 15, 7, 23 ] );
    this.renderable.setCurrentAnimation( 'walkDown' );

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // fire function throttled so that it fires only every once in a while
    this.fire = throttle(400, true, (function() {
      var bullet = me.pool.pull( "bullet", this.pos.x, this.pos.y, { direction : this.renderable.current.name } );
      me.game.world.addChild( bullet, this.z);
      me.game.world.sort();
    }).bind(this) );

    this.oldVel = new me.Vector2d(0, 0);
  },

  /* -----

     update the player pos

     ------ */
  update: function(dt) {

    // shoot or move. Don't allow both at the same time
    if ( me.input.isKeyPressed( 'fire' ) ) {
      this.fire();
      this.vel.x = 0;
      this.vel.y = 0;
    } else {
      // left/right movement
      if (me.input.isKeyPressed('left')) {
        this.vel.x -= this.accel.x * me.timer.tick;
      } else if (me.input.isKeyPressed('right')) {
        this.vel.x += this.accel.x * me.timer.tick;
      } else {
        this.vel.x = 0;
      }

      // up/down movement
      if ( me.input.isKeyPressed('up') ) {
        this.vel.y -= this.accel.y * me.timer.tick;
      } else if ( me.input.isKeyPressed('down') ) {
        this.vel.y += this.accel.y * me.timer.tick;
      } else {
        this.vel.y = 0;
      }
    }

    // set the correct animation
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

    // check & update player movement
    this.updateMovement();

    var res = me.game.world.collide(this);

    if ( res ) {
      // if we collide with an enemy
      if ( res.obj.type == me.game.ENEMY_OBJECT && res.obj.alive ) {
        me.game.world.removeChild(res.obj);
        me.game.world.sort();

        this.parent(dt);
        return true;
      }
    }

    // update animation if necessary
    if ( this.vel.x !== 0 || this.vel.y !== 0 ) {
      // update object animation
      this.parent(dt);
      return true;
    }

    // else inform the engine we did not perform
    // any update (e.g. position, animation)
    return false;
  }

});
