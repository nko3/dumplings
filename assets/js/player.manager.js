(function () {
  "use strict";

  // master scope
  var global = this;

  function PlayerManager() {
    this._players = [];
    this._last_player_id = 0;
  }

  PlayerManager.prototype.create_players = function (number) {
    var i = 0;

    for (; i < number; ++i) {
      this._players.push(this._create_player());
    }
  };

  PlayerManager.prototype.run_players_in_queue = function (callback) {
    var self = this,
      i = 0,
      ready_interval,
      number_of_ready_players = 0,
      max_ready_players = this._players.length;

    for (; i < this._players.length; ++i) {
      (function (i) {
        self._players[i].play();

        ready_interval = setInterval(function () {
          // jeśli player jest gotowy, to zwiekszamy licznik dostpnym playerow
          if (self._players[i]._is_ready) {
            number_of_ready_players++;
          }

          // jesli wszystkie playery sa dostepne to uruchamiamy callback
          if (number_of_ready_players === max_ready_players) {
            clearInterval(ready_interval);
            callback();
          }
        }, 300);
      })(i);
    }

  };

  PlayerManager.prototype._create_player = function () {
    var uid = this._last_player_id++;
    var settings = trailer.List[uid];
    settings.id = uid;
    return new trailer.Player(settings);
  };

  // public API
  global.trailer.PlayerManager = PlayerManager;

}).call(this);