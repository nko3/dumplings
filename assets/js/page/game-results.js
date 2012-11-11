(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_answer(user) {
    var item = $("<tr />");
    var $user = $("<td/>").html($("<span/>").addClass("label").text(user.player));
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
      var list = $("<tbody/>");

      for (var i = 0; i < results.length; ++i) {
        list.append(build_single_answer(results[i]));
      }

      $(".screen-results .answers-status tbody").replaceWith(list);

      $(".success-bar .close").on("click", function () {
        $(".success-bar").remove();
      });
    }
  };
}).call(this);

