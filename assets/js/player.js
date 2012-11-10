(function () {
  "use strict";

  // master scope
  var global = this;

  function get_percent(total_seconds, percent) {
    return parseInt((total_seconds * percent / 100).toFixed(0), 10);
  }

  function get_rand_progress(from, to) {
    return parseInt((Math.random() * (to - from) + from).toFixed(0), 10);
  }

  function percent_to_seconds(percent, total_seconds) {
    return parseInt((percent / 100 * total_seconds).toFixed(0), 10);
  }

  function Player(config) {
    // console.log("[game] Player#" + config.id + "");
    // ustawienia playera
    this._config = config;
    // ID playera, inkrementowane od 0
    this._uid = config.id;
    // init library player
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

  Player.MAX_MOVIE_PLAY = 10;

  Player.prototype._create_dom = function () {
    // console.log("[game] Player#"  + this._uid + " _create_dom");

    var container = $("<div />").attr({
      "id": "player_" + this._uid
    });
    $(".videos").append(container);

    this._dom = container;
  };

  Player.prototype._create_player = function () {
    // console.log("[game] Player#"  + this._uid + " _create_player");

    var name = 'player_' + this._uid;

    jwplayer(name).setup({
      "file": this._config.url,
      "width": '300',
      "height": '200'
    });

    this._lib = jwplayer(this._uid)
    // console.log(this._lib);
  };

  Player.prototype._init = function () {
    // console.log("[game] Player#"  + this._uid + " _init");

    // tworzymy DOM do nowego gracza
    this._create_dom();
    // tworzym instacje player JWPLAYER
    this._create_player();

    // wylaczamy kontrolki
    this._lib.setControls(true);
    // console.log("[player] controls: hide");

    // max glosnika
    this._lib.setVolume(0);
    // console.log("[player] volume: max");
  };

  Player.prototype._events = function () {
    var self = this,
      started = false;

    // console.log("[game] Player#"  + this._uid + " _events");

    this._lib.onBeforePlay(function () {
//      console.log("[game] Player#"  + self._uid + " onBeforePlay");
      if (self._is_ready) {
        // jeśli player jest gotowy to nic nie rób
        return false;
      }

      // seekujemy do losowej wartosci
      var rand_percent = get_rand_progress(5, 25);
      var rand_second = get_percent(self._config.duration, rand_percent);
      self._lib.seek(rand_second);
      console.log("[game] seek #" + self._uid + " do " + rand_percent + "% dla tego filmu bedzie to " + rand_second + "s");


      $(".videos-wrapper .progress .bar").animate({
        width: "+=5%"
      });

      self._start_time = rand_second;
    });

    this._lib.onTime(function () {
//      console.log("[game] Player#"  + self._uid + " onTime");
      if (self._is_ready) {
        // jeśli player jest gotowy to nic nie rób
        return false;
      }

      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);
//      console.log("current_time", current_time);

      // zatrzymanie aby zbuforować od konkretnej minuty
      if (!started && current_time !== 0) {
        self._lib.pause();
      }
      started = true;
    });

    this._lib.onBufferChange(function (buffer) {
      // console.log("[game] Player#"  + self._uid + " onBufferChange");

      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);

      // zatrzymanie po obejrzeniu 30 sekund
      if (self._start_time + Player.MAX_MOVIE_PLAY <= current_time) {
        // zatrzymaj material po Player.MAX_MOVIE_PLAY sekundach
        self._lib.stop();

      if (self._is_ready) {
        // jeśli player jest gotowy to nic nie rób
        return false;
      }
      }

      if (!self._is_ready) {
        self._end_time = percent_to_seconds(buffer.bufferPercent, self._config.duration);
      }

      if (self._start_time + Player.MAX_MOVIE_PLAY <= self._end_time) {
        if (self._lib.getState() === "PAUSED") {
          self._is_ready = true;
        }
      }
    });
  };

  Player.prototype.append_buffer = function () {
    // console.log("[game] Player#" + this._uid + " append_buffer");

    // uruchamiamy player
    this._lib.play(true);

    this.loading_timeout();
  };

  Player.prototype.play_movie = function (callback) {
    console.log("[game] Player#" + this._uid + " play");

    var self = this,
      finish_interval;

    this._dom.show();

    this._lib.play();

    finish_interval = setInterval(function () {
      var current_time = parseInt((self._lib.getPosition()).toFixed(0), 10);

//      console.log("[game] Player#" + self._uid + ": ", self._end_time, current_time);

      if (self._start_time + Player.MAX_MOVIE_PLAY <= current_time) {
        clearInterval(finish_interval);
        callback(self._uid);
      }
    }, 300);
  };


  Player.prototype.loading_timeout = function () {
    var self = this;
    setTimeout(function () {
      self._is_ready = true;
    }, 15000);
  };

  // master scope
  global.trailer.Player = Player;

}).call(this);