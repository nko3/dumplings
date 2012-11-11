(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_answer(user) {
    var item = $("<tr />");
    var $user = $("<td/>").html($("<span/>").addClass("label label-success").text(user.name));
    item.append($user);
    var $correct_field = $("<td/>").text(33);
    item.append($correct_field);
    var $competition_time = $("<td/>").text("Milion sekund :P");
    item.append($competition_time);
    return item;
  }

  global.game_results = {
    init: function () {
      var list = $("<tbody/>");

      for (var i = 0; i < versus._players.length; ++i) {
        list.append(build_single_answer(versus._players[i]));
      }

      $(".screen-results .answers-status tbody").replaceWith(list);

      $(".success-bar .close").on("click", function () {
        $(".success-bar").remove();
      });
    }
  };
}).call(this);

