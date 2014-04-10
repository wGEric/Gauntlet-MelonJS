
/* Game namespace */
var game = {
  // Run on page load.
  "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen", 480, 320, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      me.debug.renderCollisionMap = true;
      me.debug.renderHitBox = true;
      me.debug.renderVelocity = true;
      // me.debug.renderDirty = true;
      window.onReady(function () {
        me.plugin.register.defer(debugPanel, "debug");
      });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);

    // remove gravity
    me.sys.gravity = 0;
  },



  // Run on game resources loaded.
  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // add our player entity in the entity pool
    me.pool.register("mainPlayer", game.PlayerEntity);
    me.pool.register("bullet", game.BulletEntity, true);
    me.pool.register("enemy", game.EnemyEntity, true);

    // enable the keyboard
    me.input.bindKey(me.input.KEY.LEFT,  "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.UP,    "up");
    me.input.bindKey(me.input.KEY.DOWN,  "down");
    me.input.bindKey(me.input.KEY.SPACE, "fire");

    // Start the game.
    me.state.change(me.state.PLAY);
  }
};
