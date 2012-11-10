$(function(){
   socket = new io.connect(Config.socket);
   socket.on('connect', function() {
     alert('connected');
   });
});

