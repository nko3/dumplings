var mongoose = require('mongoose'), Mixed = mongoose.Schema.Types.Mixed;

//var db = mongoose.createConnection('mongodb://nodejitsu_nko3-dumplings:b3s2jallg1jj57n3pl3qirtirn@ds039267.mongolab.com:39267/nodejitsu_nko3-dumplings_nodejitsudb25521072');
var db = mongoose.createConnection('mongodb://localhost/dumplings');

var movieSchema = mongoose.Schema({
  yt: Mixed,
  created : { type: Date, default: Date.now }
});

var MovieDB = db.model('movies', movieSchema);

var playerSchema = mongoose.Schema({
  name: String,
  created : { type: Date, default: Date.now }
});

var PlayerDB = db.model('players', playerSchema);

var gameSchema = mongoose.Schema({
  state: { type: String, default: 'new' },
  players: Array, 
  movies: Mixed,
  correct: Mixed,
  answers: Array,
  created : { type: Date, default: Date.now }
});

var GameDB = db.model('games', gameSchema);


module.exports = {
  Movie: MovieDB,
  Game: GameDB,
  Player: PlayerDB
}
