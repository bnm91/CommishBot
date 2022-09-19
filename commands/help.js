var { produceResponseObjectForText } = require("../helpers/utils");
var matcher = /!help/;

function run(command, request) {
  return {
    text:
      "Commands:\n" +
      "!pins\n" +
      "!all\n" +
      "!roll\n" +
      "!flip\n" +
      "!ping\n" +
      "!insult\n" +
      "!scores\n" +
      "!closestScores\n" +
      "!standings\n" +
      "!trophies\n" +
      "!power\n" +
      "!activity\n" +
      "!giphy\n",
  };
}

exports.run = run;
exports.matcher = matcher;
