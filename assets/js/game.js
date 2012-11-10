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
    player_manager.create_players(5, function () {
      // wszystkie filmy juz sie zaladowaly i sa dostepne

    });

    var socket = new io.connect(Config.socket);
    socket.on('connect', function () {
      console.log('[game] connected');
    });

  });

}).call(this);

