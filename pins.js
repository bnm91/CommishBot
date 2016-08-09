//var pg = require('pg');

var botID = process.env.BOT_ID;

/**
 * Processes a !pin command and produces a JSON object response
 */
function run(command) {
  // TODO(mah68): Implement this
  console.log('pins called with command: ' + command);
  return {
    'bot_id': botID,
    'text': '~~ UNDER DEVELOPMENT ~~'
  }
}

exports.run = run;