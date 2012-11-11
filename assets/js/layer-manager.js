(function () {
  "use strict";

  // master scope
  var global = this;

  // public API
  global.layer_manager = {
    show_layer: function (name) {
      var layer_to_show = $("." + name);
      var close  = layer_to_show.find(".close");

      close.on("click", function () {
        layer_to_show.fadeOut()
      });

      layer_to_show.siblings().hide();
      layer_to_show.fadeIn();
    }
  };
}).call(this);
