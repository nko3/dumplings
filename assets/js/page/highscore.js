(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_user_score(user) {
    var item = $("<tr />");
    var $user = $("<td/>").text($("<span/>").addClass("label label-success").text(user.name));
    item.append($user);
    var $correct_field = $("<td/>").text(33);
    item.append($correct_field);
    var $competition_time = $("<td/>").text("Milion sekund :P");
    item.append($competition_time);
    return item;
  }

  global.highscore = {
    init: function () {
      socket.emit('game-highscore', function (col) {
        console.log(col);

        var list = $("<tbody/>");

        for (var i = 0; i < versus._players.length; ++i) {
          list.append(build_single_user_score(versus._players[i]));
        }

        $(".screen-highscore .highscore tbody").replaceWith(list);
      });
    }
  };
}).call(this);

