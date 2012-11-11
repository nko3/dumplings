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

  function get_winner_id(results) {
    results = results.sort(function (x, y) {
      var n = x.correct - y.correct;

      if (n !== 0) {
        return n;
      }

      return x.time - y.time;
    });

    console.log("results", results);

    return results[0].player_id;
  }

  function update_view_answer_status(results) {
    var is_winner = false,
      list = $("<tbody/>"),
      winner_id = get_winner_id(results);

    for (var i = 0; i < results.length; ++i) {
      is_winner = (winner_id == results[i].player_id);
      list.append(build_single_answer(results[i], is_winner));
    }

    $(".screen-results .answers-status tbody").replaceWith(list);

    $(".success-bar .close").on("click", function () {
      $(".success-bar").remove();
    });
  }

  function build_single_youtube_url(movie) {
    var item = $("<tr />");
    var $movie_name = $("<td/>").html($("<span/>").addClass("label").text(movie.title));
    item.append($movie_name);
    var youtube_link = $("<a/>").attr({
      "href": movie.url,
      "rel": "outerlink"
    }).text(movie.url);
    var $movie_youtube_url = $("<td/>").html(youtube_link);
    item.append($movie_youtube_url);
    return item;
  }

  function update_view_youtube() {
    var movies = trailer.Movies,
      list = $("<tbody/>");

    for (var i = 0; i < movies.length; ++i) {
      list.append(build_single_youtube_url(movies[i]));
    }

    $(".screen-results .movies-youtube-present tbody").replaceWith(list);
  }

  /// public API
  global.game_results = {
    init: function (results) {
      update_view_answer_status(results);
      update_view_youtube();

      pklib.utils.action.outerlink();
    }
  };
}).call(this);

