(function () {
  "use strict";

  // master scope
  var global = this;

  function Movie(config) {
    // console.log("[game] Movie#" + config.id + "");
    // ustawienia materialu filmoweg
    this._config = config;
    // ID filmu, inkrementowane od 0
    this._uid = config.player_id;
    // init library jwplayer
    this._lib = null;
    // reprezentacja DOM
    this._dom = null;

    // sekunda od ktorej zaczynamy buforowac film
    this._start_time = 0;
    // sekunds do ktorej mozna odtworzyc film zbuforowany
    this._end_time = 0;

    // czy jest gotowy do odtworzenia
    // - czy sie zbuforowalo ileś tam procent to przestawiamy flage
    // - albo po timeoutcie przestawiamy flage
    this._is_ready = false;

    // run flow
    this._init();
    // install events
    this._events();
  }

  Movie.MAX_MOVIE_PLAY = 10;

  Movie.prototype._create_dom = function () {
    var name = 'movie_' + this._uid;

    var container = $("<div />").attr({
      "id": name
    });
    $(".videos").append(container);

    this._dom = container;
  };

  Movie.prototype._create_jwplayer_install = function () {
    var name = 'movie_' + this._uid;

    jwplayer(name).setup({
      "file": this._config.url,
      "width": '750',
      "height": '400'
    });

    this._lib = jwplayer(this._uid)
  };

  Movie.prototype._init = function () {
    // tworzymy DOM do nowego gracza
    this._create_dom();
    // tworzym instacje player JWPLAYER
    this._create_jwplayer_install();

    // wylaczamy kontrolki
    this._lib.setControls(false);

    // max glosnika
    this._lib.setVolume(0);
  };

  Movie.prototype._events = function () {
    var self = this,
        started = false;

    this._lib.onBeforePlay(function () {
      if (self._is_ready) {
        return false;
      }

      // seekujemy do losowej wartosci
      var rand_percent = get_rand_value_between(5, 20);
      var rand_second = get_value_of_percent(self._config.duration, rand_percent);
      self._lib.seek(rand_second);
      // console.log("[game] seek #" + self._uid + " do " + rand_percent + "% dla tego filmu bedzie to " + rand_second + "s");

      game_process_indicator.grow_loading_bar();

      self._start_time = rand_second;
    });

    this._lib.onTime(function () {
      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);
      var timeout = self._lib.getPosition() - self._start_time;

      trailer.ANSWER_TIMEOUT = timeout;

      watch_movie_process_indicator.grow(get_percent_value_of(timeout, Movie.MAX_MOVIE_PLAY));

      if (self._is_ready) {
        return false;
      }

      // zatrzymanie aby zbuforować od konkretnej minuty
      if (!started && current_time !== 0) {
        self._lib.pause();
      }

      started = true;
    });

    this._lib.onBufferChange(function (buffer) {
      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);

      // zatrzymanie po obejrzeniu 30 sekund
      if (self._start_time + Movie.MAX_MOVIE_PLAY <= current_time) {
        self._lib.stop();
      }

      if (!self._is_ready) {
        self._end_time = get_percent_value_of(buffer.bufferPercent, self._config.duration);
      }

      if (self._is_ready) {
        return false;
      }

      if (self._start_time + Movie.MAX_MOVIE_PLAY <= self._end_time) {
        if (self._lib.getState() === "PAUSED") {
          self._is_ready = true;
        }
      }
    });
  };

  Movie.prototype.load_buffer = function () {
    // uruchamiamy movie
    this._lib.play(true);

    // uruchamiamy timeout, aby maksymalnie po 15 sekundach przerwac oczekiwanie
    this.load_buffer_timeout();
  };

  Movie.prototype.load_buffer_timeout = function () {
    var self = this;
    setTimeout(function () {
      if (!self._is_ready) {
        console.log("load buffer timeout #" + self._uid);
        self._is_ready = true;
      }
    }, 20 * 1000);
  };

  Movie.prototype.play_movie = function (callback) {
    // console.log("[game] Movie#" + this._uid + " play URL " + this._config.url);

    trailer.MOVIE_ID = this._config.id;

    trailer.ANSWER_TIMEOUT = 0;

    var self = this,
        finish_interval;

    game_process_indicator.update_current_page_number(this._uid + 1);

    this._dom.show();
    this._lib.setVolume(100);
    this._lib.play();

    finish_interval = setInterval(function () {
      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);

      if (self._start_time + Movie.MAX_MOVIE_PLAY <= current_time) {
        watch_movie_process_indicator.grow(100);

        clearInterval(finish_interval);
        callback(self._uid);
      }
    }, 300);
  };

  Movie.prototype._create_dom_answer = function (answer_obj) {
    var item = $("<li />");
    var link = $("<a />").html(answer_obj.title).addClass("btn btn-large");
    link.attr("answer_id", answer_obj.id);
    link.on("click", function (evt) {
      var li = $(this).parent();
      var siblings = li.siblings();
      siblings.find("a").off("click mousedown");

      $(this).addClass("btn-warning");
      answer_manager.send_answer($(this).attr("answer_id"));

      evt.preventDefault();
    });
    item.append(link);
    return item;
  };

  Movie.prototype.show_answers = function () {
    // console.log("[game] Movie#" + this._uid + " show_answers");

    var self = this,
      answers = this._config.answers,
      list = $("<ul />");

    for (var i = 0; i < answers.length; ++i) {
      list.append(self._create_dom_answer(answers[i]))
    }

    $(".answers").empty();
    $(".answers").append(list);
    $(".answers").append($("<div />").addClass("clearfix"));
  };

  // public API
  global.trailer.Movie = Movie;

}).call(this);