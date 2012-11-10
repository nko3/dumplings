(function () {
  "use strict";

  // master scope
  var global = this;

  function PlayerManager() {
    this._players = [];
    this._last_player_id = 0;
  }

  PlayerManager.prototype.create_players = function (number, load_all_movies_fn) {
    var i = 0;

    for (; i < number; ++i) {
      this._players.push(this._create_player());
    }

    this._load_all_movies(load_all_movies_fn);
  };

  PlayerManager.prototype._load_all_movies = function (callback) {
    var self = this,
      i = 0,
      ready_players = 0,
      max_ready_players = this._players.length;

    for (;i < max_ready_players; ++i) {
      (function (x) {
        self._players[x].onReady(function () {
          console.log("player #" + x + " is ready!");
          ready_players++;
        });
      })(i);
    }

    var check_ready_interval = setInterval(function () {
      console.log("ready_players", ready_players);
      if (ready_players === max_ready_players) {
        clearInterval(check_ready_interval);

        // jesli wszystkie beda dostepne
        callback();
      }
    }, 30);
  };

  PlayerManager.prototype._create_player = function () {
    var uid = this._last_player_id++;
    var player = new trailer.Player({
      "id": uid,
      "url": trailer.List[uid].url
    });
    return player;
  };

  // public API
  global.trailer.PlayerManager = PlayerManager;

}).call(this);