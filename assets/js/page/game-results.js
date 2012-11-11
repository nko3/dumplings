(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_answer(user, is_winner) {
    var item = $("<tr />");
    var $user = $("<td/>").html($("<span/>")
      .addClass("label " + ((is_winner) ? "label-success" : ""))
      .text(user.player + ((is_winner) ? " - WINNER!" : "")));
    item.append($user);
    var $correct_field = $("<td/>").text(user.correct);
    item.append($correct_field);
    var $competition_time = $("<td/>").text(user.time);
    item.append($competition_time);
    return item;
  }

  /// public API
  global.game_results = {
    init: function (results) {
      var is_winner = false,
        list = $("<tbody/>");

      for (var i = 0; i < results.length; ++i) {
        list.append(build_single_answer(results[i]), is_winner);
      }

      $(".screen-results .answers-status tbody").replaceWith(list);

      $(".success-bar .close").on("click", function () {
        $(".success-bar").remove();
      });
    }
  };
}).call(this);

