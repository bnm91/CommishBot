var matcher = /!insult(s|\s.*)/;
var quotes = require('../trump.json');

var templates = [
  ["subjectnametwice1", "user_name",  "subjectnametwice2", "user_name",  "predicate", "insult3", "kicker",],
  ["user_name", "subjectnamefirst", "predicate", "insult3", "kicker",],
  ["user_name", "subjectnamefirst", "predicate", "insult3", "kicker",],
  ["user_name", "subjectnamefirst", "predicate", "insult3", "kicker",],
  ["user_name", "subjectnamefirst", "predicate", "insult3", "kicker",],
  ["user_name", "subjectnamefirst", "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
  ["subjectnamesecond", "user_name",  "predicate", "insult3", "kicker",],
];

function getRandomInt(n) {
  return ((Math.floor(Math.random() * 1000000) + 1) % n)
}

function run(command, request) {
  var splitCommand = command.split(' ');

  if (command.trim() === '!insult' && splitCommand.length >= 2) {
    var personToInsult = splitCommand.slice(1).join(' ');
    var template = templates[getRandomInt(templates.length)];
    var newQuote = "";
    var word;

    for (index in template) {
      word = template[index];

      if (word == "user_name") {
        newQuote += personToInsult
        newQuote += ' '
      } else {
        newQuote += quotes[word][getRandomInt(quotes[word].length)];
      }
    }
    console.log("New Quote: " + newQuote);
    console.log(quotes);
    return {
      'text': newQuote
    }
  }
}

exports.run = run;
exports.matcher = matcher;
