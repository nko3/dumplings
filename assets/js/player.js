$(function () {
  jwplayer('video').setup({
    "file": 'http://www.youtube.com/watch?v=jI-kpVh6e1U',
    "width": '480',
    "height": '270',
    'provider': 'youtube',
    'plugins': {
      'hd-2': {}
    }
  });

  // master player
  var player = jwplayer(0);

  var seek_time = 8 * 60 * 60;

  // obslugujemy event przed rozpoczeciem odtwarzania
  player.onBeforePlay(function () {
    // seekujemy
    console.log("[player] seek", seek_time, "s");
    player.seek(seek_time);
  });

  // uruchamiamy pplayer
  player.play(true);
  console.log("[player] play");

  // wylaczamy kontrolki
  player.setControls(false);
  console.log("[player] controls: hide");

  // max glosnika
  player.setVolume(0);
  console.log("[player] volume: max");
});