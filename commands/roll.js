var matcher = /!flip/;

function run(command, request) {
  var flip = (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
  return {
    'text': flip
  }
}

exports.run = run;
exports.matcher = matcher;
