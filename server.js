
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , io = require('socket.io')
  , db = require('./db')
  , _ = require('underscore')
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


var socGames = {}, playersSoc = {}, socPlayers = {}, players = {};



function randMovies(cb) {

  var num = 5;

  db.Movie.find({}).limit(num*4).skip(parseInt(Math.random()*1000)).exec(function(err,coll) {
    var selected = {}, selected_num = 0, correct = {};

    coll.forEach(function(movie) {
      if (selected_num >= num) {
        var trig = false;
        _.each(selected, function(value,key) {
          if (_.keys(value).length <= 3 & !trig) {
            selected[key].push({ id: movie.id, title: movie.yt.title });
            trig = true;
          }
        });
      } else {
        selected[movie.yt.id] = [];
        selected[movie.yt.id].push({ id: movie.id, title: movie.yt.title });
        selected_num += 1;

        correct[movie.yt.id] = movie.id;
      }
    });

    cb(selected,correct);
  });
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

function findGame(socket,game_id,cb) {
  db.Game.findById(game_id,function(err,game) {
    if (game) {
      cb(game);
    } else {
      socket.emit('error','GAME NOT FOUND');
    }
  });
}


io.on('connection', function(socket) {

  socket.on('game-play',function(id) {
    db.Game.findById(id,function(err,game) {
      if (game) {
        if (game.players.length == 2 ) {

          var isOk = true;

          game.players.forEach(function(player){
            if (!getPS(player)) {
              socket.emit('error',"NOT EVERY PLAYER ONLINE");
              isOk = false;
            }
          });

          if (isOk) {
            game.players.forEach(function(player) {
              getPS(player).emit('game-played',{
                movies: game.movies
              });
            });

          }


        }
      }
    });
  });

  socket.on('game-create',function() {
    // create game for this session
    
    if (!getSP(socket.id)) {
      socket.emit('error','Login player first socket = '+socket.id);
      return 0;
    }

    var game = new db.Game({
      players: [getSP(socket.id)]
    });

    game.save(function(error) {
      if (!error) {
        randMovies(function(movies,correct) {
          game.movies = movies;
          game.correct = correct;
          game.save(function(error) {
            if (!error) {
              socket.emit('game-create',game.id);
            }
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


      // p1 - 1/5, 1/20, 1 = 1.25
      // p2 - 1/20, 1/20, 1 = 1.1
      // p1 - 1, 1, 1
      // p2 - 1, 1, 1/25
      // p1 - 1/50, 1/50, 1/50
      // p2 - 1/5,1,1/5



      if (won_by_time == won_by_correct) {
        game.players.forEach(function(player) {
          
        });
      }



    });

  }); 

  socket.on('game-join',function(id) {
    // find game
    // check state
    // check if everybody is online
    // add players

    db.Game.findById(id,function(err,game) {
      if (game) {

        if (game.players.length < 2 ) {

          var isOk = true;

          game.players.forEach(function(player){
            if (!getPS(player)) {
              socket.emit('error',"NOT EVERY PLAYER ONLINE");
              isOk = false;
            } else {
              //getPS(player).emit('error','PLAYER '+player+' is connecting...');
            }
          });

          if (isOk) {
            game.players.push(getSP(socket.id));
            game.save(function(err) {
              game.players.forEach(function(player){
                if (getPS(player)) {
                  getPS(player).emit('game-ready',{ players: game.players });

                  setTimeout(function() {
                    getPS(player).emit('game-start',{
                      movies: game.movies
                    });
                  },5000);

                }
              });
            });
          } else {
            socket.emit('error',"GAME IS FUCKED UP");
          }

        } else {
          socket.emit('error','GAME HAS 2 PLAYERS ALREADY');
        }

      } else {
        socket.emit('error','GAME DO NOT EXISTS');
      }
    });



  });

  socket.on('player-login', function(id) {
    // log given player to current socket
    players[id] = socket.id;
  });

  socket.on('player-create', function(name) {
    var player = new db.Player({ name: name });
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

  if (app.get('env') == 'production') {
    socket = 'http://dumplings.nko3.jit.su/';
  } else {
    socket = 'http://localhost:3000/';
  }

  res.render('index', { title: 'TrailerPOP', config: { socket: socket, env: app.get('env') } });
});

