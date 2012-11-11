(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.versus = {
    init: function () {
      console.log("[page] versus.init");
      var percent = 0,
        loading_interval;

      loading_interval = setInterval(function () {
        if (percent > 100) {
          clearInterval(loading_interval);
          versus_process_indicator.grow(100);
        } else {
          percent += 20;
          versus_process_indicator.grow(percent);
        }
      }, 1000);
    },

    set_players: function (players) {
      console.log("[page] versus.set_players", players);
      var left_player = players[0],
        right_player = players[1];

      $(".left-opponent").html(left_player);
      $(".right-opponent").html(right_player);
    }
  };
}).call(this);
