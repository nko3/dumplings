/*
 * GET home page.
 */

exports.index = function (req, res) {
  "use strict";

  var socket;

  if (app.get('env') == 'production') {
    socket = 'http://dumplings.nko3.jit.su/';
  } else {
    socket = 'http://localhost:3000/';
  }

  res.render('index', {
    title: 'Trailer Challenge', config: {
      socket: socket,
      env: app.get('env')
    }
  });
};
