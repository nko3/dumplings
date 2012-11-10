$(function () {
  jwplayer('video').setup({
    file: 'http://www.youtube.com/watch?v=jI-kpVh6e1U',
    width: '480',
    height: '270'
  });

  // master player
  var player = jwplayer(0);

  // obslugujemy event przed rozpoczeciem odtwarzania
  player.onBeforePlay(function () {
    // console.log(arguments);

    console.log({
      total_time: this.getDuration(),
      total_time2: player.getDuration(),
      total_time3: jwplayer(0).getDuration()
    });


    player.seek(8 * 60 * 60);

  });

  // uruchamiamy pplayer
  player.play(true);

  // wylaczamy kontrolki
  player.setControls(false);

  // max glosnika
  player.setVolume(100);
});