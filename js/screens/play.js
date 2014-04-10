game.PlayScreen = me.ScreenObject.extend({
  /** 
   *  action to perform on state change
   */
  onResetEvent: function() {
    var level = 'level0';

    if ( document.location.hash.indexOf('level') !== -1 ) {
      level = document.location.hash.substr( 1 );
    }

    me.levelDirector.loadLevel(level);
  },


  /** 
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent: function() {
    ; // TODO
  }
});
