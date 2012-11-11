(function () {
  "use strict";

  // master scope
  var global = this;

  // global namespace
  var trailer = global.trailer = {};

  global.trailer.List = [];

  // ID gry
  trailer.GAME_ID = 0

  // ID aktualnego mateiału filmowego
  trailer.MOVIE_ID = 0;

  // czas jaki user oglada film przed wyslaniem odpowiedzi
  trailer.ANSWER_TIMEOUT = 0;

  // let's rock!
  $(function () {

    global.socket = new io.connect(Config.socket, {
      reconnect: true
    });

    socket.on('connect', function () {
      console.log('[game] ✓ connected');
    });

    socket.on('disconnect', function() {
      console.log('[game] ✗ socket disconnected');
    });

    socket.on('reconnecting', function() {
      console.log('[game] reconnecting...');
    });

    socket.on('reconnect', function() {
      console.log('[game] ✓ reconnected');
      flow_adapter.init();
    });


    socket.on('game-ready', function (data) {
      console.log('[game] ✓ game-ready', data);

      // pokazuje VERSUS
      screen_manager.show_screen("screen-versus");
      versus.init();

      // uzupelniamy nazwy playerow
      // narazie niestety sa to ID'ki
      versus.set_players(data.players);
    });

    socket.on('game-start', function (data) {
      console.log('[game] ✓ game-start', data);

      trailer.List = data.movies;

      screen_manager.show_screen("screen-game");

      var player_manager = new trailer.MovieManager();

      // stworz playery
      player_manager.create_movies(trailer.List.length);

      game_process_indicator.show_progress_bar();
      video_manager.hide_videos();

      player_manager.load_all_movies_buffer(function () {
        console.log("✓ All movies loaded");

        video_manager.show_videos();
        answer_manager.show_answers();

        game_process_indicator.show_play_bar();
        game_process_indicator.hide_progress_bar();

        player_manager.play_queue(function () {
          console.log("✓ All movies played!");

          video_manager.hide_videos();
          answer_manager.hide_answers();

          game_process_indicator.hide_play_bar();

          socket.emit("game-stop", trailer.GAME_ID);
          console.log("COMMAND game-stop \"" + trailer.GAME_ID + "\"");

        }, player_manager._movies);
      });
    });

    socket.on('game-create', function (id) {
      console.log('[game] ✓ game-created', id);

      trailer.GAME_ID = id;

      screen_manager.show_screen("screen-send-link");

      var protocol = document.location.protocol;
      var host = document.location.host;
      var pathname = document.location.pathname;
      var game_url = "/game=" + id;

      $(".send-link").val(protocol + "//" + host + pathname + "#" + game_url);

      // NEXT STEP
      // document.location.hash = game_url;

      sent_link.init();
    });

    socket.on('player-create', function (data) {
      console.log('[game] ✓ player-create', data.id);

      pklib.cookie.create("user_id", data.id);

      // spradzamy czy user wchodzi z linku
      flow_adapter._game_flow();
    });

    // socket.emit('game-answer', game_id, movie_id, answer_id, time);
    socket.on('game-answered', function (data) {
      console.log('[game] ✓ game-answered', data);

      var link = $("[answer_id=" + data.answer_id + "]");
      var result = link.prev();
      result.fadeIn();
      result.addClass((data.correct) ? "alert-success" : "alert-danger");
      var answer = ((data.correct) ? "✓" : "✗") + " <strong>" + data.player_name + "</strong> " + data.time.toFixed(3) + "s";
      var $answer = $("<p/>").html(answer);
      result.append($answer);
    });

    socket.on("game-stopped", function (data) {
      console.log('[game] ✓ game-stopped', data);

      // var results = data.results;
      // var player = data.player;

      screen_manager.show_screen("screen-results");
      game_results.init(data.results);
    });

    // common error handler
    socket.on('error', function (msg) {
      console.log('[ERROR] ✗', msg);

      new trailer.Message().error("SOCKET_ERROR: " + msg);
    });

    socket.on('status', function (data) {
      console.log('[dashboard] ✓ status: ', data);

      var points = data.points;

      if (typeof points !== "number") {
        points = 0;
      }

      $(".dashboard .games").text(data.games);
      $(".dashboard .points").text(points.toFixed(3));
    });
  });
}).call(this);

