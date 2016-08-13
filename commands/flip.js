var matcher = /!roll(\s.*)/;

function run(command, request) {
  var dieSides = '';
  if (command.length > 5 && command.startsWith('!roll ')) {
    dieSides = command.slice(5).replace(/\s/g, '');
    if (isNaN(dieSides)) {
      var roll = 'roll is not a number';
    } else{
      var roll = Math.floor((Math.random() * parseInt(dieSides)) + 1).toString();
    }
  }
  return {
    'text': roll
  }
}

exports.run = run;
exports.matcher = matcher;
