(function () {
  "use strict";

  // master global
  var global = this;

  function game_link_exists() {
    return "game" in get_hash_params();
  }

  // public API
  global.flow_adapter = {
    init: function () {
      // console.log("[game] flow_adapter.init");

      var user_id = pklib.cookie.get("user_id");

      if (user_id !== null) {
        // JEST COOKIE
        socket.emit('player-login', user_id);
        console.log("COMMAND player-login", user_id);

        flow_adapter._game_flow();
      } else {
        // NIE MA COOKIE
        // pokazujemy panel logowania
        flow_adapter._login_flow();
      }
    },

    submit_login_form: function (name) {
      // console.log("[game] flow_adapter.submit_login_form");

      pklib.cookie.create("user_name", name);

      socket.on('player-create', function (data) {
        console.log('[game] ✓ player created', data.id);

        pklib.cookie.create("user_id", data.id);

        // spradzamy czy user wchodzi z linku
        flow_adapter._game_flow();
      });

      socket.emit("player-create", name);
      console.log("COMMAND: player-create: " + name);
    },

    _game_flow: function () {
      if (game_link_exists()) {
        // TAK
        socket.on('game-ready', function (players) {
          console.log('[game] ✓ game-ready', players);

          // pokazuje VERSUS
          screen_manager.show_screen("screen-versus");
          versus.init();
        });

        socket.on('game-start', function (data) {
          console.log('[game] ✓ game-start', data);

          trailer.List = data.movies;

          for (var i = 0; i < trailer.List.length; ++i) {
            trailer.List[i].duration = 3 * 60;
          }

          screen_manager.show_screen("screen-game");

          var player_manager = new trailer.MovieManager();

          // stworz playery
          player_manager.create_movies(5);
          player_manager.load_all_movies_buffer(function () {
            console.log("✓ All movies loaded");

            video_manager.show_videos();
            process_indicator.show_play_bar();
            process_indicator.hide_progress_bar();

            player_manager.play_queue(function () {
              console.log("✓ All movies played!");

              video_manager.hide_videos();

              screen_manager.show_screen("screen-thanks");
              process_indicator.hide_play_bar();

            }, player_manager._movies);
          });
        });

        var game_id = get_hash_params("game");
        socket.emit("game-join", game_id);
        console.log("COMMAND game-join", game_id);
      } else {
        // NIE
        socket.on('game-create', function (id) {
          console.log('[game] ✓ game created id', id);

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

        socket.emit('game-create');
        console.log("COMMAND: game-create");
      }
    },

    _login_flow: function () {
      var submit = $(".login-form .submit"),
        name = $(".name");

      // keypress - > active submit
      name.keyup(function () {
        var _T = $(this);

        if (_T.val().length) {
          submit.removeClass("disabled");
        } else {
          submit.addClass("disabled");
        }
      });

      $(".login-form form").submit(function (evt) {
        if (Config.env === "production") {
          alert("Wypierdalaj " + name.val() + "!");
        } else {
          flow_adapter.submit_login_form(name.val());
        }

        evt.preventDefault();
      });
    }
  };

  $(function () {
    flow_adapter.init();
  });
}).call(this);