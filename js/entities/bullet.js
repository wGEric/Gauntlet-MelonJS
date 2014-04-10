game.BulletEntity = me.ObjectEntity.extend({

  init: function(x, y, settings) {
    settings.image = 'entities';
    settings.spritewidth = 32;
    settings.spriteheight = 32;

    if (!settings.width) {
      settings.width = 32;
    }

    if (!settings.height) {
      settings.height = 32;
    }

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
    this.type = 'bullet';

    this.direction = settings.direction.replace('walk', '').toLowerCase();
  },

  update: function(dt) {
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

    var curAnimation;
    if ( this.vel.x < 0 || ( this.vel.x === 0 && this.vel.y < 0 ) ) {
      curAnimation = 'shootLeft';
    } else {
      curAnimation = 'shoot';
    }

    if (curAnimation && !this.renderable.isCurrentAnimation(curAnimation) && !this.renderable.isCurrentAnimation('explode')) {
      this.renderable.setCurrentAnimation(curAnimation);
    }

    // check & update movement
    var envRes = this.updateMovement();

    // remove if it hits a wall or goes off screen
    if ( envRes.xtile || envRes.ytile || ! this.inViewport ) {

      if ( ! this.inViewport ) {
        this.removeBullet();
      } else  if (!this.renderable.isCurrentAnimation('explode')) {
        this.renderable.setCurrentAnimation( 'explode', (function () {
          this.removeBullet();
          return false; // do not reset to first frame
        }).bind(this) );
      }

      // update object animation
      this.parent(dt);
      return true;
    }

    if ( this.vel.x !== 0 || this.vel.y !== 0 ) {
      // update object animation
      this.parent(dt);
      return true;
    }

    // else inform the engine we did not perform
    // any update (e.g. position, animation)
    this.parent(dt);
    return true;
  },

  removeBullet: function() {
    me.game.world.removeChild( this );
    me.game.world.sort();
  }
});
