var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://nodejitsu_nko3-dumplings:b3s2jallg1jj57n3pl3qirtirn@ds039267.mongolab.com:39267/nodejitsu_nko3-dumplings_nodejitsudb25521072');

var movieSchema = mongoose.Schema({
  name: String,
  yt: String,
  time: Number,
  created : { type: Date, default: Date.now }
});

var MovieDB = db.model('movies', movieSchema);

var playerSchema = mongoose.Schema({
  name: String,
  created : { type: Date, default: Date.now }
});

var PlayerDB = db.model('players', playerSchema);

var gameSchema = mongoose.Schema({
  name: String,
  created : { type: Date, default: Date.now }
});

var GameDB = db.model('games', gameSchema);


module.exports = {
  Movie: MovieDB,
  Game: GameDB,
  Player: PlayerDB
}
