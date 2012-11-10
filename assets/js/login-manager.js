(function () {
  "use strict";

  // master scope
  var global = this;

  function exists_game_id() {
    return "game" in get_hash_params();
  }

  // public API
  global.login_manager = {
    init: function () {
      // spradzamy czy user wchodzi z linku
      login_manager.check();

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
        console.log("[game] logining...");

        if (Config.env === "production") {
          alert("Wypierdalaj " + name.val() + "!");
        } else {
          pklib.cookie.create("user_name", name.val());

          socket.emit("player-create", name.val());
          console.log("COMMAND: player-create: " + name.val());
        }

        evt.preventDefault();
      });
    },

    check: function () {
      var user_id = pklib.cookie.get("user_id");

      if (user_id !== null) {
        login_manager.login(user_id);
        if (exists_game_id()) {
          login_manager.game_join();
          game_manager.init_versus();
        } else {
          game_manager.init_send_link_screen(user_id);
        }
      }
    },

    login: function (id) {
      socket.emit('player-login', id);
    },

    game_join: function () {
      socket.emit("game-join", get_hash_params("game"));
    }
  };

  // go go go!
  $(function () {
    login_manager.init();
  });
}).call(this);
