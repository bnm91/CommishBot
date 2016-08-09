var HTTPS = require('https');
var cached = require('./cached');
var pins = require('./pins');

var botID = process.env.BOT_ID;

/**
 * Extracts request message and responds if necessary.
 */
function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  message = request.text;
  if (message.charAt(0) == '!') {
    response = run(message);
    send(response, this);
  }
}

/**
 * Processes a message and returns a json response object.
 * @private
 */
function run(command) {
	console.log('run reached ' + command);
  var response = null;
  if (command.startsWith('!pin ')) {
    return pins.run(command);
  }
  else if (command.startsWith('!data ')){
	return dbTest.run(command);
  }
  
  if (command == '!all') {
    userIds = [];
    for (i = 0; i < cached.members.length; i++) {
      member = cached.members[i];
      userIds.push(member.userId);
    }

    response = {
      'bot_id' : botID,
      'text' : '@all',
      'attachments': [
        {
          'loci': [[0,4],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
          'type': 'mentions',
          'user_ids': userIds
        }
      ]
    };
  } else if (command == '!ping') {
    response = {
      'bot_id': botID,
      'text': 'pong'
    }
  } else if (command == '!flip') {
    var flip = (Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails';
    response = {
      'bot_id': botID,
      'text': flip
    }
  }else if (command == '!roll'){
    var roll = Math.floor((Math.random() * 100) + 1).toString();
    response = {
      'bot_id': botID,
      'text': roll
    }
  }

  return response;
}

/**
 * Send request to GroupMe API to post message on bot's behalf
 * @private
 */
function send(response, responder) {
  responder.res.writeHead(200);

  var options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  var req = HTTPS.request(options, function(res) {
    if(res.statusCode != 202) {
      console.log('rejecting bad status code ' + res.statusCode);
      console.log(res);
    }
  });

  req.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  req.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  req.end(JSON.stringify(response));

  responder.res.end();
}

exports.respond = respond;
