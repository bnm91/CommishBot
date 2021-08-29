var matcher = /!insult(s|\s.*)/;
var insults = require("../constants/insults.js");

function getRandomInt(n) {
  return (Math.floor(Math.random() * 1000000) + 1) % n;
}

function run(command, request) {
  var splitCommand = command.split(" ");

  if (splitCommand.length >= 2) {
    var personToInsult = splitCommand.slice(1).join(" ");
    var newQuote =
      personToInsult +
      " " +
      insults[Math.floor(Math.random() * insults.length)];

    for (index in template) {
      word = template[index];

      if (word == "user_name") {
        newQuote += personToInsult;
        newQuote += " ";
      } else {
        newQuote += quotes[word][getRandomInt(quotes[word].length)];
      }
    }

    return {
      text: newQuote,
    };
  }
}

exports.run = run;
exports.matcher = matcher;
