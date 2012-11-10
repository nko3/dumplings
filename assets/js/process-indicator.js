(function () {
  "use strict";

  // master scope
  var global = this;

  global.process_indicator = {
    hide_play_bar: function () {
      $(".play-bar").hide();
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

    grow_loading: function (val, max) {
      var percent = get_percent_value_of(val, max);
      if (percent <= 100) {
        $(".videos-wrapper .progress .bar").animate({
          width: percent + "%"
        });
      }
    },

    grow_loading_bar: function () {
      $(".videos-wrapper .progress .bar").animate({
        width: "+=5%"
      });
    }
  };
}).call(this);