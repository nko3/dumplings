(function () {
  "use strict";

  // master scope
  var global = this;

  function get_percent(total_seconds, percent) {
    return total_seconds * percent / 100;
  }

  function get_rand_progress(from, to) {
    return (Math.random() * (to - from) + from).toFixed(0);
  }

  function Player(config) {
    console.log("[game] Player#" + config.id + "");
    // ustawienia playera
    this._config = config;
    // ID playera, inkrementowane od 0
    this._uid = config.id;
    // init library player
    this._lib = null;
    // czas ustawiany losowo
    this._start_time = null;

    // run flow
    this._init();
    // install events
    this._events();
    // go go go
    this.play();
  }

  Player.MAX_MOVIE_PLAY = 30;

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
    var self = this;
    // console.log("[game] Player#"  + this._uid + " _events");

    this._lib.onBeforePlay(function () {
      // console.log("[game] Player#"  + self._uid + " onBeforePlay");

      // seekujemy do losowej wartosci
      var rand_percent = get_rand_progress(5, 25);
      var rand_second = get_percent(self._config.duration, rand_percent);
      self._lib.seek(rand_second);
      console.log("[game] seekujemy do " + rand_percent + "% dla tego filmu bedzie to " + rand_second + "s");

      self._start_time = rand_second;
    });

    this._lib.onTime(function () {
      var current_time = (self._lib.getPosition()).toFixed(0);
      if (self._start_time + Player.MAX_MOVIE_PLAY <= current_time) {
        // zatrzymaj material po Player.MAX_MOVIE_PLAY sekundach
        self._lib.stop();
      }
    });
  };

  Player.prototype._create_dom = function () {
    // console.log("[game] Player#"  + this._uid + " _create_dom");

    var container = $("<div />").attr({
      "id": "player_" + this._uid
    });
    $("#videos").append(container);
  };

  Player.prototype._create_player = function () {
    // console.log("[game] Player#"  + this._uid + " _create_player");

    var name = 'player_' + this._uid;

    jwplayer(name).setup({
      "file": this._config.url,
      "width": '480',
      "height": '270'
    });

    this._lib = jwplayer(this._uid)
    // console.log(this._lib);
  };

  Player.prototype.play = function () {
    console.log("[game] Player#" + this._uid + " play");

    // uruchamiamy player
    this._lib.play(true);
  };

  // master scope
  global.trailer.Player = Player;

}).call(this);