
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


var socGames = {}, playersSoc = {}, socPlayers = {};



function randMovies(cb) {

  var num = 5;

  db.Movie.find({}).limit(num*4).skip(parseInt(Math.random()*1000)).exec(function(err,coll) {
    var selected = {}, selected_num = 0;

    coll.forEach(function(movie) {
      if (selected_num >= num) {
        _.each(selected, function(value,key) {
          if (_.keys(value).length <= 3) {
            selected[key].push({ id: movie.id, title: movie.yt.title });
          }
        });
      } else {
        selected[movie.yt.id] = []
        selected[movie.yt.id].push({ id: movie.id, title: movie.yt.title });
        selected_num += 1;
      }
    });

    console.log(selected);
  });
}

randMovies();


io.on('connection', function(socket) {
  socket.on('game-request',function(id) {
  });

  socket.on('game-create',function() {
    // create game for this session
   
    if (!socPlayers[socket]) {
      socket.emit('error','Login player first');
      return 0;
    }

    var game = new db.Game({
      players: [socPlayers[socket]]
    });

    game.save(function(error) {
      if (!error) {
        socket.emit('game-create',game.id);
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
            if (!playersSoc[player]) {
              socket.emit('error',"NOT EVERY PLAYER ONLINE");
              isOk = false;
            } else {
              playersSoc[player].emit('error','PLAYER '+player+' is connecting...');
            }
          });

          if (isOk) {
            game.players.push(player);
            game.save(function(err) {
              socket.emit('game-join',{ players: game.players });

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
    playersSoc[id] = socket;
    socPlayers[socket] = id;
  });

  socket.on('player-create', function(name) {
    var player = new db.Player({ name: name });
    player.save(function(error) {
      if (!error) {
        socket.emit('player-create',{ id: player.id });
      }
    })
  });

});


app.get('/', function(req, res){

  if (app.get('env') == 'production') {
    socket = 'http://dumplings.nko3.jit.su/';
  } else {
    socket = 'http://localhost:3000/';
  }

  res.render('index', { title: 'Express', config: { socket: socket } });
});

