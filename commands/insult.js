var matcher = /!insult(s|\s.*)/;
var insults = require("../constants/insults.js");

function getRandomInt(n) {
  return (Math.floor(Math.random() * 1000000) + 1) % n;
}

function run(command, request) {
  var splitCommand = command.split(" ");

  if (splitCommand.length >= 2) {
    var personToInsult = splitCommand[1];
    var newQuote =
      personToInsult +
      " " +
      insults[Math.floor(Math.random() * insults.length)];

    return {
      text: newQuote,
    };
  }
}

exports.run = run;
exports.matcher = matcher;
