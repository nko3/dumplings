(function () {
  "use strict";

  // master scope
  var global = this;

  global.process_indicator = {
    update_current_page_number: function (id) {
      $(".current-page").html(id);
    },

    update_total_page_number: function (id) {
      $(".total-page").html(id);
    },

    hide_progress_bar: function () {
      $(".videos-wrapper .progress").remove();
    },

    loading: function (number, players) {
      var partial_percent = players.length;
      var percent = parseInt((number / partial_percent * 100).toFixed(0), 10);
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