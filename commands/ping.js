var matcher = /!ping/;

function run(command, request) {
  return {
    text: "pong",
  };
}

exports.run = run;
exports.matcher = matcher;
