(function () {
  "use strict";

  // master scope
  var global = this;

  // aktualna liczba procentow loadera
  var current_percent_progress = 0;

  function can_change(new_percent) {
    return new_percent > current_percent_progress && new_percent < 100;
  }

  function update_progress_view(percent) {
    $(".videos-wrapper .progress .bar").animate({
      width: percent + "%"
    });
  }

  function update_progress(percent) {
    // console.log("percent", percent);
    if (can_change(percent)) {
      update_progress_view(percent);
      current_percent_progress = percent;
    }
  }

  global.process_indicator = {
    hide_play_bar: function () {
      $(".play-bar").fadeOut();
    },

    show_play_bar: function () {
      $(".play-bar").fadeIn();
    },

    update_current_page_number: function (id) {
      $(".current-page").html(id);
    },

    update_total_page_number: function (id) {
      $(".total-page").html(id);
    },

    hide_progress_bar: function () {
      $(".videos-wrapper .progress").remove();
    },

    grow_loading_percent_value: function (val, max) {
      // console.log("grow_loading_percent_value", val, max);
      update_progress(get_percent_value_of(val, max));
    },

    grow_loading_bar: function () {
      update_progress(current_percent_progress + 5);
    }
  };
}).call(this);