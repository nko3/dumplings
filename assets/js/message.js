(function () {
  "use strict";

  // master scope
  var global = this;

  /*
   <div class="alert alert-error">
   <a class="close">×</a>
   <strong>Error</strong> Change a few things up and try submitting again.
   </div>
   */
  function create_message_box(TYPE) {
    var container = $("<div/>").addClass("message alert").addClass("alert-" + TYPE);
    var p  = $("<p/>");
    var close = $("<a/>").addClass("close").text("×");
    var strong = $("<strong/>").text(pklib.string.capitalize(TYPE));
    container.append(close);
    p.append(strong);
    container.append(p);
    return container;
  }

  function update(message) {
    $(".messages").html(message);
    return message;
  }

  function show_message(message) {
    $(".messages").show();
    message.animate({
      "top": ($(window).height() - message.height()) / 2
    });
  }

  function close_message(message) {
    message.find(".close").on("click", function () {
      var message = $(this).parent();
      message.animate({
        "top": "-1000px"
      }, function () {
        message.remove();
      });
    });
  }

  function Message() {}

  Message.INFO = "info";
  Message.ERROR = "error";

  Message.prototype._create_instance = function (type, msg) {
    var message = create_message_box(type);
    message.find("p").append(" " + msg);
    update(message);
    show_message(message);
    close_message(message);
    return message;
  };

  Message.prototype.info = function (msg) {
    return this._create_instance(Message.INFO, msg);
  };

  Message.prototype.error = function (msg) {
    return this._create_instance(Message.ERROR, msg);
  };

  // public API
  global.trailer.Message = Message;
}).call(this);
