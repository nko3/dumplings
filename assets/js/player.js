(function () {
  "use strict";

  // master scope
  var global = this;

  function Player(id) {
    this._id = id;
  }

  Player.prototype._init = function () {

  };

  // Player
  global.trailer.Player = Player;
}).call(this);
