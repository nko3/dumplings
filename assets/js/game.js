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

    global.socket = new io.connect(Config.socket, {
      reconnect: false
    });

    socket.on('connect', function () {
      console.log('[game] connected');
    });

    // socket.emit('player-create', 'CHOSEN_NAME');

    socket.on('player-create', function(data) {

      // TODO: Save player id to cookie

      console.log('[player] created');
      console.log(data); // data.id 

    });

    // socket.emit('game-create')

    socket.on('game-create', function(id) {
      console.log('[game] created id:'+id);
    });


    // common error handler
    socket.on('error', function(msg) {
      console.log('[ERROR]',msg);
    });



  });

}).call(this);

