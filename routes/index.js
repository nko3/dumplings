
/*
 * GET home page.
 */

exports.index = function(req, res){

  if (app.get('env') == 'production') {
    socket = 'http://dumplings.nko3.jit.su/';
  } else {
    socket = 'http://localhost:3000/';
  }

  res.render('index', { title: 'TrailerPOP', config: { socket: socket } });
};
