(function () {
  "use strict";

  // master scope
  var global = this;

  function build_single_user_score(score) {
    var item = $("<tr />");

    var user = $("<span/>").addClass("label");
    user.text(score.name);

    var $user = $("<td/>").html(user);
    item.append($user);

    var $score = $("<td/>").text(parseInt(score.points, 10));
    item.append($score);
    return item;
  }

  // public API
  global.highscore = {
    init: function () {
      socket.emit('game-highscore', function (scores) {
        console.log('[game] ✓ game-stopped', scores);

        var list = $("<tbody/>");

        for (var i = 0; i < scores.length; ++i) {
          var score_row = build_single_user_score(scores[i]);
          list.append(score_row);
        }

        $(".layer-highscore .highscore tbody").replaceWith(list);
      });
      console.log("COMMAND game-highscore /callback/");
    }
  };
}).call(this);

