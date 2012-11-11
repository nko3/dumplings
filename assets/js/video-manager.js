(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.video_manager = {
    show_videos: function () {
      // console.log("video_manager.show_videos");
      $(".videos-wrapper").css({
        width: 750,
        height: 400
      });
      $(".videos").animate({ "left": 0 });
    },

    hide_videos: function () {
      // console.log("video_manager.hide_videos");
      $(".videos-wrapper").css({
        width: 1,
        height: 1
      });
    }
  };
}).call(this);
