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
    var loader = $(".versus-loading-panel .bar");
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
  global.versus_process_indicator = {
    grow: function (percent) {
      // console.log("versus_process_indicator.grow", percent);
      if (can_update(percent)) {
        update_progress_view(percent);
        current_percent_progress = percent;
      }
    }
  };
}).call(this);
