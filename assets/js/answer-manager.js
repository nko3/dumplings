(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.answer_manager = {
    show_answers: function () {
      $(".answers-wrapper").show();
    },

    hide_answers: function () {
      $(".answers-wrapper").hide();
    }
  };
}).call(this);
