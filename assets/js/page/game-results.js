(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_answer(user, is_winner) {
    var item = $("<tr />");
    var $user = $("<td/>").html($("<span/>")
      .addClass("label " + ((is_winner) ? "label-success" : ""))
      .text(user.player_name + ((is_winner) ? " - WINNER!" : "")));
    item.append($user);
    var $correct_field = $("<td/>").text(user.correct);
    item.append($correct_field);
    var $competition_time = $("<td/>").text(user.time);
    item.append($competition_time);
    return item;
  }

  function get_winnder_id(results) {
    results = results.sort(function (x, y) {
      var n = x.correct - y.correct;

      if (n !== 0) {
        return n;
      }

      return x.time - y.time;
    });

    return results[0].player_id;
  }

  /// public API
  global.game_results = {
    init: function (results) {
      var is_winner = false,
        list = $("<tbody/>"),
        winner_id = get_winnder_id(results);

      for (var i = 0; i < results.length; ++i) {
        is_winner = (winner_id == results[i].player_id);
        list.append(build_single_answer(results[i], is_winner));
      }

      $(".screen-results .answers-status tbody").replaceWith(list);

      $(".success-bar .close").on("click", function () {
        $(".success-bar").remove();
      });
    }
  };
}).call(this);

