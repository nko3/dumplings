(function () {
  "use strict";

  // master scope
  var global = this;

  global.sent_link = {
    init: function () {
      console.log("[page] sent_link.init");
      $(".send-link").focus(function () {
        $(this).select();
      });
    }
  };
}).call(this);