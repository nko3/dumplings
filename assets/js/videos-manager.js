(function () {
  "use strict";

  // master scope
  var global = this;

  global.videos_manager = {
    show_videos: function () {
      $(".videos").animate({ "left": 0 });
    },

    hide_videos: function () {
      $(".answers-wrapper, .videos-wrapper").hide();
    },

    show_thanks: function () {
      $(".thank-you").fadeIn();
    }
  };
}).call(this);
