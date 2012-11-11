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
    var loader = $(".watch-movie-time-progress .bar");
    loader.css({
      width: percent + "%"
    });

    if (percent > 0) {
      loader.html(percent + "%");
    } else {
      loader.empty();
    }
  }

  // public API
  global.watch_movie_process_indicator = {
    clear: function () {
      // console.log("watch_movie_process_indicator.clear");
      update_progress_view(0);
      current_percent_progress = 0;
    },

    grow: function (percent) {
      // console.log("watch_movie_process_indicator.grow", percent);
      if (can_update(percent)) {
        update_progress_view(percent);
        current_percent_progress = percent;
      }
    }
  };
}).call(this);
