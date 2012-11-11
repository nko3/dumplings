(function () {
  "use strict";

  function create_new_game() {
    // czyscimy cookie
    // pklib.cookie.remove("user_name");
    // pklib.cookie.remove("user_id");
    // redirect do glownej strony
    var protocol = document.location.protocol;
    var host = document.location.host;
    var url = protocol + "//" + host;
    document.location = url;
  }

  function show_rules() {
    layer_manager.show_layer("layer-rules");
  }

  function show_highscore() {
    layer_manager.show_layer("layer-highscore");
    highscore.init();
  }

  $(function () {
    console.log("[game] Trailer Challenge - GO GO GO!");
    console.log("------------------------------------");

    trailer.setup_game(function () {
      flow_adapter.init();
    });

    pklib.utils.action.outerlink();

    $(".js-start-new-game, .page-header h1").on("click", create_new_game);
    $(".js-show-rules").on("click", show_rules);
    $(".js-show-highscore").on("click", show_highscore);
  });

}).call(this);