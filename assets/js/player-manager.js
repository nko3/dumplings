(function () {
  "use strict";

  // master scope
  var global = this;

  function PlayerManager() {
    this._players = [];
    this._last_player_id = 0;
  }

  PlayerManager.prototype.create_players = function (number) {
    console.log("[game] PlayerManager create_players");

    var i = 0;

    for (; i < number; ++i) {
      this._players.push(this._create_player());
    }

    process_indicator.update_total_page_number(number);
  };

  PlayerManager.prototype._create_player = function () {
    var uid = this._last_player_id++;
    var settings = trailer.List[uid];
    settings.id = uid;
    return new trailer.Player(settings);
  };

  PlayerManager.prototype.load_all_players_buffer = function (callback) {
    console.log("[game] PlayerManager load_all_players_buffer");

    var self = this,
      ready_players = 0,
      ready_interval,
      i = 0,
      max_ready_players = this._players.length;

    for (; i < max_ready_players; ++i) {
      self._players[i].load_buffer();
    }

    ready_interval = setInterval(function () {
      // zliczamy gotowe playery
      ready_players = self._get_number_of_ready_players();

      // aktualizujemy pasek postepu
      process_indicator.grow_loading_percent_value(ready_players, max_ready_players);

//      console.log("ready_players", ready_players, "max_ready_players", max_ready_players);

      // jeśli wszystkie są ready to uruchamiamy callback
      if (ready_players === max_ready_players) {
        clearInterval(ready_interval);
        callback();
      }
    }, 10);
  };

  PlayerManager.prototype._get_number_of_ready_players = function () {
    var ready_players = 0;
    for (var i = 0; i < this._players.length; ++i) {
      if (this._players[i]._is_ready) {
        ready_players++;
      }
    }
    return ready_players;
  };

  PlayerManager.prototype.play_queue = function (callback, players) {
//    console.log("[game] PlayerManager play_queue");

    var self = this,
        last = null;

    players = players.slice();

    // jesli tablica jest pusta wywolaj callback
    if (players.length === 0) {
      callback();
    } else {
      players[0].play_movie(function (uid) {
        last = players.shift();
        last._lib.remove(function () {
          // $("#" + last._uid).remove();
        });

        console.log("[game] Played#" + uid + " finish");
        self.play_queue(callback, players);
      });
    }
  };

  // public API
  global.trailer.PlayerManager = PlayerManager;

}).call(this);