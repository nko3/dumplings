$(function () {
  var submit = $(".login-form .submit");
  var name = $(".name");

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
    if (!submit.hasClass("disabled")) {
      alert("Wypierdalaj " + name.val() + "!");
    }

    evt.preventDefault();
  });
});