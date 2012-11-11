(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.video_manager = {
    show_videos: function () {
      $(".videos").animate({ "left": 0 });
    },

    hide_videos: function () {
      // nope
    }
  };
}).call(this);
