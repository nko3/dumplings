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
    console.log("[game] player created ", config.id);
    // ustawienia playera
    this._config = config;
    // ID playera, inkrementowane od 0
    this._uid = config.id;
    // set flags
    this.timeout_to_get_total_time = false;
    // init library player
    this._lib = null;
    // run flow
    this._init();
  }
  
  Player.prototype._init = function () {
    // tworzymy DOM do nowego gracza
    this._create_dom();
    // tworzym instacje player JWPLAYER
    this._create_player();
    
    // wylaczamy kontrolki
    this._lib.setControls(false);
    // console.log("[player] controls: hide");

    // max glosnika
    this._lib.setVolume(0);
    // console.log("[player] volume: max");
  };

  Player.prototype._create_dom = function () {
    var container = $("<div />").attr({
      "id": "player_" + this._uid
    });
    $("#videos").append(container);
  };

  Player.prototype._create_player = function () {
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
    var self = this;

    // uruchamiamy player
    this._lib.play(true);
    console.log("[player] play");

    this._lib.onPlay(function () {
      if (!self._lib.timeout_to_get_total_time) {
        // zatrzymujemy
        self._lib.stop();

        setTimeout(function () {
          // seekujemy do losowej wartosci
          var rand = get_rand_progress(5, 50);
          self._lib.seek(get_percent(self._lib.getDuration(), rand));
          console.log("[player] seekujemy do ", rand);

          // odtwarzamy z juz przeseekowanym materialem
          self._lib.play(true);
        }, 1000);
        self._lib.timeout_to_get_total_time = true;
      }
    });    
  };

  Player.prototype.onReady = function (callback) {
    this._lib.onBufferChange(function (buffer) {
      console.log("buffer", buffer);
      if (buffer === 100) {
        callback();
      }
    });
  };

  // master scope
  global.trailer.Player = Player;

}).call(this);