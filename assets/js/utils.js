// console.log
var old = console.log;

console.log = function () {
  var args = Array.prototype.slice.call(arguments);
  var date = new Date();
  var hours = date.getHours();
  var minute = lpad(date.getMinutes(), 2, "0");
  var seconds = lpad(date.getSeconds(), 2, "0");
  var milliseconds = lpad(date.getMilliseconds(), 3, "0");
  var date_str = hours + ":" + minute + ":" + seconds + "." + milliseconds + " ";
  args.unshift(date_str);
  old.apply(console, args);
};

// left padding any chars
function lpad(staff, nr_fill, add_char) {
  var string = staff.toString(),
    i = string.length;

  for (; i < nr_fill; ++i) {
    string = add_char + string;
  }

  return string;
}