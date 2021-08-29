var { produceResponseObjectForText } = require("../helpers/utils");
var matcher = /!help/;

function run(command, request) {
  return {
    text:
      "Commands:\n" + "!pins\n" + "!all\n" + "!roll\n" + "!flip\n" + "!ping\n",
  };
}

exports.run = run;
exports.matcher = matcher;
