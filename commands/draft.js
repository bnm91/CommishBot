var matcher = /!draft/;

function run(command, request) {
  var countDownDate = new Date("Aug 23, 2021 20:30:00 EST").getTime();

  var now = new Date().getTime();
  var timeleft = countDownDate - now;
  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
  var text =
    "The draft is in " +
    days +
    " days, " +
    hours +
    " hours, " +
    minutes +
    " minutes, " +
    seconds +
    " seconds";
  return {
    text: text,
  };
}

exports.run = run;
exports.matcher = matcher;
