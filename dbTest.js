var pg = require('pg');

var botID = process.env.BOT_ID;

/**
 * Processes a !pin command and produces a JSON object response
 */
function run(command) {
  // TODO(mah68): Implement this
	var textOut;
	console.log('dbTest called with command: ' + command);
	
	var client = new pg.Client(process.env.DATABASE_URL);

	client.connect();
	
      var query = client.query('SELECT * FROM test_table WHERE test_table_key=$1', [1]);
      query.on('row', function(row, result) {
        result.addRow(row);
      });
      query.on('end', function(result) {
        if (result.rowCount === 0) {
          textOut = 'no rows';
          return;
        } else if (result.rowCount > 1) {
          textOut = 'too many rows';
          return;
        }

        textOut = 'data test: '+ result.rows[0].content;
      });
      query.on('error', function(err) {
        textOut = 'err';
      });
  
  return {
    'bot_id': botID,
    'text': textOut
  }
}

exports.run = run;