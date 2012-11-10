(function () {
  "use strict";

  // master scope
  var global = this;

  // global namespace
  global.trailer = {};

  // let's rock!
  $(function () {

    global.socket = new io.connect(Config.socket, {
      reconnect: false
    });

    socket.on('connect', function () {
      console.log('[game] connected');
    });

    // socket.emit('player-create', 'CHOSEN_NAME');

    socket.on('player-create', function (data) {
      console.log('[game] ✓ player created', data.id);

      pklib.cookie.create("user_id", data.id);

      // spradzamy czy user wchodzi z linku
      login_manager.check();
    });

    // socket.emit('game-create')

    socket.on('game-create', function (id) {
      console.log('[game] ✓ game created id', id);

      game_manager.init_send_link_screen(id);
    });

    // socket.emit('game-join',id)

    socket.on('game-join', function (game) {
      console.log('[game] ✓ player joined', game);
    });

    // socket.emit('game-start',id)

    socket.on('game-ready', function (game) {
      console.log('[game] ✓ game ready', game);
      game_manager.init_versus();
    });

    socket.on('game-start', function (players) {
      console.log('[game] ✓ game start', players);
    });

    // socket.emit('game-answer', game_id, movie_id, answer_id, time);
    socket.on('game-answer', function (game_id, movie_id, answer_id, time, player_id, correct) {
      console.log('[game] ✓ game answer', player_id, correct);
    });

    // common error handler
    socket.on('error', function (msg) {
      console.log('[ERROR] ✗', msg);
    });
  });
}).call(this);

