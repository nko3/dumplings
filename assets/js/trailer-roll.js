(function () {
  "use strict";

  function create_new_game() {
    // czyscimy cookie
    pklib.cookie.remove("user_name");
    pklib.cookie.remove("user_id");
    // redirect do glownej strony
    var protocol = document.location.protocol;
    var host = document.location.host;
    var url = protocol + "//" + host;
    document.location = url;
  }

  function show_rules() {
    screen_manager.show_screen("screen-rules");
  }

  function show_highscore() {
    screen_manager.show_screen("screen-highscore");
    highscore.init();
  }

  $(function () {
    flow_adapter.init();

    $(".js-start-new-game, .page-header h1").on("click", create_new_game);
    $(".js-show-rules").on("click", show_rules);
    $(".js-show-highscore").on("click", show_highscore);
  });

}).call(this);