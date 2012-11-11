/**
 * TrailerRoll
 */

"use strict";

console.log("TrailerRoll starting");

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , io = require('socket.io')
  , dbSchema = require('./db')
  , _ = require('underscore')
  , async = require('async')
  , mongoose = require('mongoose')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(require('connect-assets')());
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'))
var io = io.listen(server);

// global bucket for player sockets
var players = {};

// movies cache
var movies = [];
var mongoURI;

io.configure('development', function () {
  io.disable('log');
  mongoURI = 'mongodb://nodejitsu_nko3-dumplings:ohkkhs8l2imtcf4paphpnrmv7o@ds039257.mongolab.com:39257/nodejitsu_nko3-dumplings_nodejitsudb3493680560';
  console.log('ENV:DEVELOPMENT');
});

io.configure('production', function () {
  io.disable('log');
  mongoURI = 'mongodb://nodejitsu_nko3-dumplings:b3s2jallg1jj57n3pl3qirtirn@ds039267.mongolab.com:39267/nodejitsu_nko3-dumplings_nodejitsudb25521072';
  console.log("ENV:PRODUCTION");
});

var db = mongoose.createConnection(mongoURI);

var GameDB    = db.model('games',   dbSchema.gameSchema);
var PlayerDB  = db.model('players', dbSchema.playerSchema);
var MovieDB   = db.model('movies',  dbSchema.movieSchema);


function preloadMovieDB() {
  MovieDB.find({}).select('yt.id yt.duration name').exec(function(err,coll) {
    coll.forEach(function(movie) {
      movies.push({
        id: movie.id,
        yt: movie.yt.id,
        du: movie.yt.duration,
        na: movie.name
      });
    });
    movies = _.shuffle(movies); 
    console.log("Preloaded "+movies.length+" movies do node process");
  });
}

preloadMovieDB();


function randMovies(cb) {
  var num = 5;

  var coll = movies.splice( parseInt( (Math.random()*(movies.length-20)) ),20);

  var selected = [], selected_num = 0, correct = {};

    coll.forEach(function(movie) {
      if (selected_num >= num) {
        var trig = false;
        _.each(selected, function (value, key) {
          if (!("answers" in selected[key])) {
            selected[key].answers = [];
          }
          if (selected[key].answers.length <= 3 & !trig) {
            selected[key].answers.push({
              id: movie.id,
              title: movie.na
            });
            trig = true;
            selected[key].answers = _.shuffle(selected[key].answers); 
          }
        });
      } else {
        selected.push({
          id: movie.yt,
          url: "http://www.youtube.com/watch?v=" + movie.yt,
          duration: movie.du,
          answers: [{
            id: movie.id,
            title: movie.na
          }]
        });

        selected_num += 1;

        correct[movie.yt] = movie.id;
      }
    });

    cb(selected, correct);
}




var GameManager;

GameManager = (function() {

  function GameManager(sockets) {
    this.sockets = sockets;
  }

  GameManager.prototype.addPlayer = function(socket) {

  };

  return GameManager;

})();







var gm = new GameManager(io.sockets);



function getPS(player_id) {
  var to = players[player_id];
  return io.sockets.socket(to)
}

function getSP(socket_id) {
  return _.invert(players)[socket_id]
}

function findGame(socket,gameId,cb) {
  GameDB.findById(gameId,function(err,game) {
    if (game) {
      cb(game);
    } else {
      socket.emit('error','GAME NOT FOUND');
    }
  });
}

function forEachPlayer(players,cb) {
  players.forEach(function(player){
    if (!getPS(player)) {
      cb(player,true);
    } else {
      cb(player,false);
    }
  });
}

function findPlayer(id,cb) {
   PlayerDB.findById(id,function(err,player) {
    if (player) {
      cb(player);
    } else {
      //socket.emit('error','PLAYER NOT FOUND');
    }
  });

}


io.on('connection', function(socket) {

  socket.on('game-play',function(gameId) {
    findGame(socket,gameId,function(game) {
      if (game.players.length == 2 ) {

          var isOk = true;

          forEachPlayer( game.players, function(player,playerExists) {
            if (!playerExists) {
              socket.emit('error',"NOT EVERY PLAYER ONLINE");
              isOk = false;
            }
          });


          if (isOk) {

            // If everything is OK send movies to challange palyers

            forEachPlayer( game.players, function(player,playerExists) {
              if (playerExists) {
                getPS(player).emit('game-played',{
                  movies: game.movies
                });
              }
            });

          }

      } // if number of players is enough
    });
  });

  socket.on('game-create',function() {
    // create game for this session
    
    if (!getSP(socket.id)) {
      socket.emit('error','Login player first socket = '+socket.id);
      return 0;
    }

    var game = new GameDB({
      players: [getSP(socket.id)]
    });

    game.save(function(error) {
      if (!error) {
        randMovies(function(movies,correct) {
          game.movies = movies;
          game.correct = correct;
          var currentPlayer = getSP(socket.id);

          findPlayer(currentPlayer,function(player) {

            game.playersInfos.push({ name: player.name });

            game.save(function(error) {
              if (!error) {
                socket.emit('game-create',game.id,game.playersInfos);
              }
            });

          });

        });
      }
    });

  });

  socket.on('game-answer', function(game_id,movie_id,answer_id,time) {
    // take game
    // check if answer is correct
    findGame(socket,game_id,function(game) {

      // TODO: check if it's not over time
      //
      //

      var goodAnswer = game.correct[movie_id] == answer_id;

      game.players.forEach(function(player) {
        console.log('player',player,goodAnswer);
        getPS(player).emit('game-answered',game_id,movie_id,answer_id,time,getSP(socket.id),goodAnswer);
      });

      game.answers.push({
        player_id: getSP(socket.id),
        movie_id: movie_id,
        answer_id: answer_id,
        time: time,
        correct: goodAnswer
      });

      game.save(function() {
        // fuck results
      });


    });

  });

  socket.on('game-stop',function(gameId) {
    // TODO: Check time
    //
    
    findGame(socket,gameId,function(game) {


      var answer_correct = {}, answer_time = {}; 

      game.players.forEach(function(player) {
        answer_correct[player] = [];
        answer_time[player] = [];
      });

      game.answers.forEach(function(answer) {
        if (answer.correct) {
          answer_correct[answer.player_id] += 1;
          answer_time[answer.player_id] += answer.time;
        }
      });

      var won_by_correct = _.invert(answer_correct)[_.max(answer_correct)];
      var won_by_time = _.invert(answer_correct)[_.min(answer_time)];

      
      var lastResults = [];

      //game.playersInfos[]

      game.players.forEach(function(player) {
        lastResults.push({
          player_id: player,
          correct: answer_correct[player],
          time: answer_time[player]
        });
      });

      forEachPlayer( game.players, function(player,playerExists) {
        if (playerExists) {
          getPS(player).emit('game-stopped',{
            results: lastResults,
            players: game.playersInfos
          });
        }
      });

    });

  }); 

  socket.on('game-join',function(gameId) {
    // find game
    // check state
    // check if everybody is online
    // add players

    findGame(socket,gameId,function(game) {

        if (game.players.length < 2 ) {

          var isOk = true, currentPlayer;
        
          currentPlayer = getSP(socket.id);

          if (_.indexOf(game.players,currentPlayer) > -1) {
            socket.emit('error',"Sorry but You can't play with yourself. At least use incognito mode");
            isOk = false;
          }


          game.players.push(currentPlayer); // current player
          game.players.forEach(function(player){
            if (!getPS(player)) {
              socket.emit('error',"NOT EVERY PLAYER ONLINE");
              isOk = false;
            } else {
            }
          });

          if (isOk) {

            findPlayer(currentPlayer,function(player) {
              game.playersInfos.push({name:player.name});
              game.save(function(err) {
                game.players.forEach(function(player){
                  if (getPS(player)) {
                    getPS(player).emit('game-ready',{ players: game.playersInfos });

                    setTimeout(function() {
                      getPS(player).emit('game-start',{
                        movies: game.movies,
                        players: game.playersInfos
                      });
                    },6000);

                  }
                });
              });

            });
          } else {
            socket.emit('error',"GAME IS FUCKED UP");
          }
        } else {
          socket.emit('error','GAME HAS 2 PLAYERS ALREADY');
        }
    });



  });

  socket.on('player-login', function(id) {
    // log given player to current socket
    players[id] = socket.id;
  });

  socket.on('player-create', function(name) {
    var player = new PlayerDB({ name: name });
    player.save(function(error) {
      if (!error) {
        players[player.id] = socket.id;
        socket.emit('player-create',{ id: player.id });
      }
    })
  });

  //setInterval(function() {
  //  socket.emit('error',players);
  //},5000)

});

app.get('/', function(req, res){
  var socket;

  if (app.get('env') == 'production') {
    socket = 'http://dumplings.nko3.jit.su/';
  } else {
    socket = 'http://localhost:3000/';
  }

  res.render('index', { title: 'TrailerRoll', config: { socket: socket, env: app.get('env') } });
});

