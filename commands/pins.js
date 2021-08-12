var pg = require('pg');

var dbUrl = process.env.DATABASE_URL;
var matcher = /!pin(s|\s.*)/;

/**
 * Processes a !pin command and produces a JSON object response
 * @returns {Promise<Object>} a promise of the response object.
 */
 function run(command, request) {
  pg.defaults.ssl = { rejectUnauthorized: false };

  var splitCommand = command.split(' ');
  if (command.trim() === '!pins') {
    // Command to list all pins
    return listPins();
  }
  if (splitCommand.length === 2) {
    // Command to show a pin's value
    return showPin(splitCommand[1].toLowerCase());
  } 
  if (splitCommand.length >= 3 && splitCommand[1] === "create") {
    // Command to create a pin
    var content = splitCommand.slice(3).join(' ');
    return createPin(splitCommand[2], content);
  } 
  if (splitCommand.length >= 3 && splitCommand[1] === "remove") {
    // Command to remove a pin
    return removePin(splitCommand[2].toLowerCase());
  }

  // Some parsing error occured.
  return produceImmediateResponse('Correct Usage:\n' +
      '!pins (list pins)\n!pin {name} (view pin)\n' +
      '!pin {name} {content} (create pin)');
}


/**
 * Lists all registered pins
 */
function listPins() {
  return new Promise(function(resolve, reject) {
    try {
      var boundCommands, client = new pg.Client(dbUrl);
      client.connect();
      var query = client.query(new pg.Query('SELECT name FROM pins'));
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        boundCommands = result.rows.map(function(currentValue) {
           return currentValue.name;
        });

        resolve(produceResponseObjectForText(
            'To view a pin use "!pin {name}"\nRegistered pin names are:\n' +
                 boundCommands.join('\n')));
      });
      query.on('error', function(err) {
        resolve(produceResponseObjectForText('Error listing pins, go hassle Mike. ' + err));
      });
    } catch (e) {
      reject(e);
    }
  });
}


/**
 * Shows a pin with a given name, otherwise give an appropriate error response.
 */
function showPin(pinName) {
  if (pinName.length > 20) {
    return produceImmediateResponse('Pin name must be shorter than 20 characters');
  }

  return new Promise(function(resolve, reject) {
    try {
      var client = new pg.Client(dbUrl);
      client.connect();
      var query = client.query(new pg.Query('SELECT * FROM pins WHERE name=$1', [pinName]));
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        if (result.rowCount === 0) {
          resolve(produceResponseObjectForText('The pin "' + pinName + '" is not registered.'));
          return;
        } else if (result.rowCount > 1) {
          resolve(produceResponseObjectForText('Some shit has gone seriously awry. Take cover.'));
          return;
        }

        resolve(produceResponseObjectForText(pinName + ': ' + result.rows[0].content));
      });
      query.on('error', function(err) {
        resolve(produceResponseObjectForText('Error showing pin content, go hassle Mike. ' + err));
      });
    } catch (e) {
      reject(e);
    }
  });
}


/**
 * Remove a pin with a given name, otherwise give an appropriate error response.
 */
 function removePin(pinName) {
  return new Promise(function(resolve, reject) {
    try {
      var client = new pg.Client(dbUrl);
      client.connect();
      var query = client.query(new pg.Query('SELECT * FROM pins WHERE name=$1', [pinName]));
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        if (result.rowCount === 0) {
          resolve(produceResponseObjectForText('The pin "' + pinName + '" is not registered.'));
          return;
        } else if (result.rowCount > 1) {
          resolve(produceResponseObjectForText('Some shit has gone seriously awry. Take cover.'));
          return;
        }
        client.query(new pg.Query('DELETE FROM pins WHERE name=$1', [pinName]));
        resolve(produceResponseObjectForText(pinName + ' has been deleted'));
      });
      query.on('error', function(err) {
        resolve(produceResponseObjectForText('Error showing pin content, go hassle Mike. ' + err));
      });
    } catch (e) {
      reject(e);
    }
  });
}


/**
 * Creates a pin if possible, or give an appropriate error response.
 */
function createPin(pinName, pinContent) {
  if (pinName.length > 20) {
    return produceImmediateResponse('Pin name must be shorter than 20 characters');
  }

  if (pinContent.length > 300) {
    return produceImmediateResponse('Pin content must be shorter than 300 characters');
  }

  return new Promise(function(resolve, reject) {
    try {
      var client = new pg.Client(dbUrl);
      client.connect();
      var selectQuery = client.query(new pg.Query('SELECT * FROM pins WHERE name=$1', [pinName]));
      selectQuery.on('row', function(row, result) {
        result.addRow(row);
      });
      selectQuery.on('end', function(result) {
        if (result.rowCount === 0) {
          var query = client.query(new pg.Query(
              'INSERT INTO pins (creator, name, content) VALUES (\'\', $1, $2);',
              [pinName, pinContent]));
          query.on('end', function() {
            resolve(produceResponseObjectForText('Pin ' + pinName + ' created successfully!\n' +
                'To view it type "!pin ' + pinName +'"'));
          });
          query.on('error', function(err) {
            resolve(produceResponseObjectForText('Error creating pin, go hassle Mike. ' + err));
          });
        } else {
          resolve(produceResponseObjectForText('Pin "' + pinName + '" already exists.'));
        }
      });

      selectQuery.on('error', function(error) {
        resolve(produceResponseObjectForText('Error creating pin, go hassle Mike. ' + err));
      })

    } catch (e) {
      reject(e);
    }
  });
}


/**
 * Produce an immediate response with some text.
 */
function produceImmediateResponse(response) {
  return produceResponseObjectForText(response);
}


/**
 * Produce a simple text response object.
 */
 function produceResponseObjectForText(text) {
  return {
      'text' : text
  };
 }

exports.run = run;
exports.matcher = matcher;
