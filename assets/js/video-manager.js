(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.video_manager = {
    show_videos: function () {
      $(".videos").animate({ "left": 0 });
      $(".answers-wrapper").fadeIn();
    },

    hide_videos: function () {
      $(".answers-wrapper, .videos-wrapper").hide();
      $(".answers-wrapper").hide();
    }
  };
}).call(this);
