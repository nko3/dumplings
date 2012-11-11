(function () {
  "use strict";

  // master scope
  var global = this;

  // aktualna liczba procentow loadera
  var current_percent_progress = 0;

  function can_update(new_percent) {
    return new_percent > current_percent_progress && new_percent <= 100;
  }

  function update_progress_view(percent) {
    var loader = $(".game-loading-panel .progress .bar");
    loader.css({
      width: percent + "%"
    });

    if (percent > 0) {
      loader.html(percent + "%");
    } else {
      loader.empty();
    }
  }

  function update_progress(percent) {
    // console.log("percent", percent);
    if (can_update(percent)) {
      update_progress_view(percent);
      current_percent_progress = percent;
    }
  }

  // public API
  global.game_process_indicator = {
    hide_play_bar: function () {
      $(".screen-game .opponents, .screen-game .play-bar").fadeOut();
    },

    show_play_bar: function () {
      $(".screen-game .opponents, .screen-game .play-bar").fadeIn();
    },

    update_current_page_number: function (id) {
      $(".current-page").html(id);
    },

    update_total_page_number: function (id) {
      $(".total-page").html(id);
    },

    show_progress_bar: function () {
      $(".screen-game .game-loading-panel").show();
    },

    hide_progress_bar: function () {
      $(".screen-game .game-loading-panel").remove();
    },

    grow_loading_percent_value_of: function (val, max) {
      update_progress(get_percent_value_of(val, max));
    },

    grow_loading_percent: function (percent) {
      update_progress(percent);
    },

    grow_loading_bar: function () {
      update_progress(current_percent_progress + 5);
    }
  };
}).call(this);