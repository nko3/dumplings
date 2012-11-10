$(function () {

  socket = new io.connect(Config.socket);
  socket.on('connect', function () {
    console.log('[game] connected');
  });

});

