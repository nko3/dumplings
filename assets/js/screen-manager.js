(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.screen_manager = {
    show_screen: function (name) {
      var screen_to_show = $("." + name);

      screen_to_show.siblings().hide();
      screen_to_show.fadeIn();
    }
  };
}).call(this);
