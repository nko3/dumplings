(function () {
  "use strict";

  // master scope
  var global = this;

  global.game_manager = {
    init: function () {
      // screen_manager.show_screen("screen-hello"); // zalatwione przez css
    },
    game: function () {
      screen_manager.show_screen("screen-game");

      var player_manager = new trailer.PlayerManager();

      // stworz playery
      player_manager.create_players(5);
      player_manager.load_all_players_buffer(function () {
        console.log("✓ All movies loaded");

        video_manager.show_videos();
        process_indicator.show_play_bar();
        process_indicator.hide_progress_bar();

        player_manager.play_queue(function () {
          console.log("✓ All movies played!");

          video_manager.hide_videos();
          video_manager.show_thanks();
          process_indicator.hide_play_bar();

        }, player_manager._players);
      });
    }
  };

  $(function () {
    // run game!
    global.game_manager.init();
  });
}).call(this);