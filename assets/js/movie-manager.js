(function () {
  "use strict";

  // master scope
  var global = this;

  function MovieManager() {
    this._movies = [];
    this._last_movie_id = 0;
  }

  MovieManager.prototype.create_movies = function (number) {
    console.log("[game] MovieManager create_movies");

    var i = 0;

    for (; i < number; ++i) {
      this._movies.push(this._create_movie());
    }

    game_process_indicator.update_total_page_number(number);
  };

  MovieManager.prototype._create_movie = function () {
    var uid = this._last_movie_id++;
    var settings = trailer.List[uid];
    settings.player_id = uid;
    return new trailer.Movie(settings);
  };

  MovieManager.prototype.load_all_movies_buffer = function (callback) {
    console.log("[game] MovieManager load_all_movies_buffer");

    var self = this,
      ready_movies = 0,
      ready_interval,
      i = 0,
      max_ready_movies = this._movies.length;

    for (; i < max_ready_movies; ++i) {
      self._movies[i].load_buffer();
    }

    ready_interval = setInterval(function () {
      // zliczamy gotowe playery
      ready_movies = self._get_number_of_ready_movies();

      // aktualizujemy pasek postepu
      game_process_indicator.grow_loading_percent_value_of(ready_movies, max_ready_movies);

//      console.log("ready_movies", ready_movies, "max_ready_movies", max_ready_movies);

      // jeśli wszystkie są ready to uruchamiamy callback
      if (ready_movies === max_ready_movies) {
        clearInterval(ready_interval);
        game_process_indicator.grow_loading_percent(100);

        setTimeout(function () {
          callback();
        }, 1000);
      }
    }, 10);
  };

  MovieManager.prototype._get_number_of_ready_movies = function () {
    var ready_movies = 0;
    for (var i = 0; i < this._movies.length; ++i) {
      if (this._movies[i]._is_ready) {
        ready_movies++;
      }
    }
    return ready_movies;
  };

  MovieManager.prototype.play_queue = function (callback, movies) {
//    console.log("[game] MovieManager play_queue");

    var self = this,
        last = null;

    movies = movies.slice();

    // jesli tablica jest pusta wywolaj callback
    if (movies.length === 0) {
      callback();
    } else {
      movies[0].play_movie(function (uid) {
        last = movies.shift();
        last._lib.remove(function () {
          // $("#" + last._uid).remove();
        });
        watch_movie_process_indicator.clear();

        console.log("[game] Played#" + uid + " finish");
        self.play_queue(callback, movies);
      });

      movies[0].show_answers();
    }
  };

  // public API
  global.trailer.MovieManager = MovieManager;

}).call(this);