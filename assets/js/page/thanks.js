(function () {
  "use strict";

  // master scope
  var global = this;

  global.thanks = {
    on_close: function (callback) {
      console.log("[page] thanks.on_close");
      setTimeout(function () {
        callback();
      }, 5 * 1000);
    }
  };
}).call(this);
