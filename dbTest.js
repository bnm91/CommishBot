var pg = require('pg');

var botID = process.env.BOT_ID;

/**
 * Processes a !pin command and produces a JSON object response
 */
function run(command) {
  // TODO(mah68): Implement this
	console.log('dbTest called with command: ' + command);
	pg.defaults.ssl = true;
	pg.connect(process.env.DATABASE_URL, function(err, client) {
	  if (err) throw err;
	  console.log('Connected to postgres! Getting schemas...');

	  client
		.query('SELECT table_schema,table_name FROM information_schema.tables;')
		.on('row', function(row) {
		  console.log(JSON.stringify(row));
		});
	});
  
  return {
    'bot_id': botID,
    'text': '~~ UNDER DEVELOPMENT ~~'
  }
}

exports.run = run;