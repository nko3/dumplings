$(function () {
  // master player
  var player = jwplayer('video');

  player.setup({
    file: 'http://www.youtube.com/watch?v=c0WcHbXUVVM',
    width: '480',
    height: '270'
  });
});