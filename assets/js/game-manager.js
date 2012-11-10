(function () {
  "use strict";

  // master scope
  var global = this;

  global.game_manager = {
    init_send_link_screen: function (id) {
      screen_manager.show_screen("screen-send-link");

      var protocol = document.location.protocol;
      var host = document.location.host;
      var pathname = document.location.pathname;
      var game_url = "/game=" + id;

      $(".send-link").val(protocol + "//" + host + pathname + "#" + game_url);

      // NEXT STEP
      // document.location.hash = game_url;

      sent_link.init();
    },

    init_versus: function () {
      screen_manager.show_screen("screen-versus");

      versus.init();
    },

    init_game_screen: function () {
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
          video_manager.show_thanks();
          process_indicator.hide_play_bar();

        }, player_manager._movies);
      });
    }
  };
}).call(this);