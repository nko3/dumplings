$(function () {
  var submit = $(".login-form .submit"),
    name = $(".name"),

    HALT_LOGIN_FORM = false;

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

    if (HALT_LOGIN_FORM) {
      alert("Wypierdalaj " + name.val() + "!");
    } else {
      console.log("COMMAND: player-create: " + name.val());
      socket.emit('player-create', name.val());
    }

    evt.preventDefault();
  });
});