$(function () {

  function get_percent(total_seconds, percent) {
    return total_seconds * percent / 100;
  }

  function get_rand_progress(from, to) {
    return (Math.random() * (to - from) + from).toFixed(0);
  }

  jwplayer('video').setup({
    "file": 'http://www.youtube.com/watch?v=6kw1UVovByw',
    "width": '480',
    "height": '270'
  });

  var player = jwplayer(0);
  player.timeout_to_get_total_time = false;


  // wylaczamy kontrolki
  player.setControls(false);
  console.log("[player] controls: hide");

  // max glosnika
  player.setVolume(0);
  console.log("[player] volume: max");

  // uruchamiamy pplayer
  player.play(true);
  console.log("[player] play");

  player.onPlay(function () {
    if (!player.timeout_to_get_total_time) {
      // zatrzymujemy
      player.stop();

      setTimeout(function () {
        // seekujemy do losowej wartosci
        var rand = get_rand_progress(5, 50);
        player.seek(get_percent(player.getDuration(), rand));
        console.log("[player] seekujemy do ", rand);

        // odtwarzamy z juz przeseekowanym materialem
        player.play(true);
      }, 1000);
      player.timeout_to_get_total_time = true;
    }
  });
});