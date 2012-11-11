(function () {
  "use strict";

  // master scope
  var global = this;

  function update_process_indicator(percent) {
    $(".versus-loading-panel .progress .bar").animate({
      width: "+=" + percent + "%"
    });
  }

  global.versus = {
    init: function () {
      var percent = 0,
        loading_interval;

      loading_interval = setInterval(function () {
        if (percent > 100) {
          clearInterval(loading_interval);
          update_process_indicator(100);
        } else {
          percent += 20;
          update_process_indicator(percent);
        }
      }, 1000);
    },

    set_players: function (players) {
      var left_player = players[0],
        right_player = players[1];

      $(".left-opponent").html(left_player);
      $(".right-opponent").html(right_player);
    }
  };
}).call(this);
