game.Network = Object.extend({
  channel: "gauntlet-melonjs",

  init: function() {
    this.pubnub = PUBNUB.init({
      publish_key: "pub-c-ee0e135a-d603-4cb8-8403-c94fa1fad4cb",
      subscribe_key: "sub-c-43dfc142-cf16-11e2-830a-02ee2ddab7fe"
    });

    // Record my UUID, so I don't process my own messages
    this.UUID = this.pubnub.uuid();

    // Listen for incoming messages
    this.pubnub.subscribe({
      channel: this.channel,
      message: this.handleMessage.bind(this)
    });

    this.lastRuns = {};
  },

  handleMessage : function (msg) {
    // Did I send this message?
    if (msg.UUID === this.UUID || ! msg.action || msg.timestamp < this.lastRuns[ msg.action ] )
      return;

    this.lastRuns[ msg.action ] = msg.timestamp;

    var player = me.game.getEntityByName( 'mainPlayer' ),
    z = 2;

    if ( player.length ) {
      player = player[0];
    }

    // Get a reference to the object for the player that sent this message
    var obj = me.game.getEntityByName(msg.UUID);
    if (obj.length) {
      obj = obj[0];
    } else {
      var x = msg.pos && msg.pos.x || 50;
      var y = msg.pos && msg.pos.y || 50;
      obj = me.entityPool.newInstanceOf( 'mainPlayer', x, y, {
        network: true
      } );
      obj.name = msg.UUID;

      me.game.add( obj, player.z );
      me.game.sort();
    }

    switch( msg.action ) {
      case 'move':
        obj.pos.setV( msg.pos );
      obj.vel.setV( msg.vel );
      break;
    }
  },

  sendMessage : function (msg) {
    msg.UUID = this.UUID;

    msg.timestamp = window.performance.now();

    this.pubnub.publish({
      channel: this.channel,
      message: msg
    });
  }
});
