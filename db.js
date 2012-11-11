"use strict";

var mongoose = require('mongoose'), Mixed = mongoose.Schema.Types.Mixed;

var movieSchema = mongoose.Schema({
  name: String,
  yt: Mixed,
  created : { type: Date, default: Date.now }
});


var playerSchema = mongoose.Schema({
  name: String,
  points: Number,
  games: Number,
  games_won: Number,
  created : { type: Date, default: Date.now }
});


var gameSchema = mongoose.Schema({
  state: { type: String, default: 'new' },
  players: Array,
  playersInfos: Array,
  movies: Mixed,
  correct: Mixed,
  answers: Array,
  created : { type: Date, default: Date.now }
});

module.exports = {
  movieSchema: movieSchema,
  gameSchema: gameSchema,
  playerSchema: playerSchema
}
