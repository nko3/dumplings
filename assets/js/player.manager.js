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

  PlayerManager.prototype.run_players_in_queue = function () {

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