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

    // socket.emit('game-create')

    // socket.emit('game-join',id)

    // socket.emit('game-start',id)

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

