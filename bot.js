var HTTPS = require('https');
var insultGenerator = require('insultgenerator');
var Promise = require('promise');

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
    response = run(request);
    send(response, this);
  }
}

/**
 * Processes a message and returns a json response object.
 * @return {Promise<Object>} promise containing response object
 * @private
 */
function run(fullRequest) {
  var command = fullRequest.text;
  var response = null;
  if (command.match(pins.matcher) != null) {
    return pins.run(command);
  }
  
  if (command.startsWith('!all')) {
    var messageToAll = '';
    if (command.length > 4 && command.startsWith('!all ')) {
      messageToAll = command.slice(4);
    }

    userIds = [];
    for (i = 0; i < cached.members.length; i++) {
      member = cached.members[i];
      userIds.push(member.userId);
    }

    response = {
      'bot_id' : botID,
      'text' : '@all' + messageToAll,
      'attachments': [
        {
          'loci': Array(userIds.length).fill([0, 4]),
          'type': 'mentions',
          'user_ids': userIds
        }
      ]
    };
  } else if (command.startsWith('!fuckyou')) {
    // TODO actually use user mentions
    var usersToInsult = [];
    if (fullRequest.attachments !== undefined) {
      for (i = 0; i < fullRequest.attachments.length; i++) {
        if (fullRequest.attachments[i].type === 'mentions') {
          usersToInsult == fullRequest.attachments[i].user_ids;
          break;
        }
      }
    }

    return new Promise(function(resolve, reject) {
      insultGenerator(function(insult) {
        resolve({
          'bot_id' : botID,
          'text' : insult
        });
      });
    })
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
  } else if (command == '!roll') {
    var roll = Math.floor((Math.random() * 100) + 1).toString();
    response = {
      'bot_id': botID,
      'text': roll
    }
  }

  return Promise.resolve(response);
}

/**
 * Send request to GroupMe API to post message on bot's behalf
 * @private
 */
function send(responsePromise, responder) {
  responsePromise.then(function(response) {
    sendHttpRequest(response, responder);
  }, function(error) {
    response = {
      'bot_id': botID,
      'text': 'There was an error processing the request: ' +
          JSON.stringify(error)
    }
  });
}

function sendHttpRequest(response, responder) {
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
