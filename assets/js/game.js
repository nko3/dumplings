(function () {
  "use strict";

  // master scope
  var global = this;

  // global namespace
  global.trailer = {};

  // let's rock!
  $(function () {

    var player_manager = new trailer.PlayerManager();
    // stworz playery
    player_manager.create_players(3);
    player_manager.run_players_in_queue(function () {
      console.log("All movies loaded")
    });

    global.socket = new io.connect(Config.socket);
    socket.on('connect', function () {
      console.log('[game] connected');
    });

  });

}).call(this);

