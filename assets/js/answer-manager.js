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
    },

    send_answer: function (id) {
      console.log("[game] answer_manager.send_answer", id);
      socket.emit('game-answer', trailer.GAME_ID, trailer.MOVIE_ID, id, trailer.ANSWER_TIMEOUT);
      console.log("COMMAND: game-answer", trailer.GAME_ID, trailer.MOVIE_ID, id, trailer.ANSWER_TIMEOUT);
    }
  };
}).call(this);
