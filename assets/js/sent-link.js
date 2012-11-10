(function () {
  "use strict";

  // master scope
  var global = this;

  global.sent_link = {
    init: function () {
      $(".send-link").focus(function () {
        $(this).select();
      });
    }
  };
}).call(this);