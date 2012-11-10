$(function () {
  var submit = $(".login-form .submit"),
    name = $(".name");

  // keypress - > active submit
  name.keyup(function () {
    var _T = $(this);

    if (_T.val().length) {
      submit.removeClass("disabled");
    } else {
      submit.addClass("disabled");
    }
  });

  $(".login-form form").submit(function (evt) {
    console.log("[game] logining...");

    if (Config.evn === "production") {
      alert("Wypierdalaj " + name.val() + "!");
    } else {
      socket.emit("player-create", name.val());
      console.log("COMMAND: player-create: " + name.val());
    }

    evt.preventDefault();
  });
});