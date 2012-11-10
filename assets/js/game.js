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
      console.log('[player] created');
      console.log(data); // data.id

      pklib.cookie.create("user_id", data.id);

      socket.emit('game-create');
      console.log("COMMAND: game-create");
    });

    // socket.emit('game-create')

    socket.on('game-create', function (id) {
      console.log('[game] created id:' + id);

      document.location.hash = "#/game/" + id;
    });

    // socket.emit('game-join',id)

    socket.on('game-join', function (game) {
      console.log('[game] joined', game);
    });

    // socket.emit('game-start',id)

    socket.on('game-play', function (game) {
      console.log('[game] start', game);
    });

    // socket.emit('game-answer', game_id, movie_id, answer_id, time);
    socket.on('game-answer', function (game_id, movie_id, answer_id, time, player_id, correct) {
      console.log('[game] answer', player_id, correct);
    });

    // common error handler
    socket.on('error', function (msg) {
      console.log('[ERROR] ✗', msg);
    });
  });
}).call(this);

