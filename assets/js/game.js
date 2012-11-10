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
    player_manager.create_players(5);
    player_manager.load_all_players_buffer(function () {
      $(".videos").animate({
        "left": 0
      });
      $(".videos-wrapper .progress").remove();
      console.log("✓ All movies loaded");

      player_manager.play_queue(function () {
        console.log("✓ All movies played!");

        $(".answers-wrapper, .videos-wrapper").hide();
        $(".thank-you").fadeIn();
      }, player_manager._players);
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

    // socket.emit('game-join',id)

    socket.on('game-join', function(game) {
      console.log('[game] joined',game);
    });

    // socket.emit('game-start',id)
    socket.on('game-play', function(game) {
      console.log('[game] start', game);
    });

    // common error handler
    socket.on('error', function(msg) {
      console.log('[ERROR]',msg);
    });



  });

}).call(this);

