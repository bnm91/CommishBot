var HTTPS = require('https');
var cached = require('./cached');

const botID = 'e898d148370087f718e4b90e1e';


function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  message = request.text;
  response = process(message);
  if (response) {
    send(response, this);
  }
}

function process(message) {
  if (message.charAt(0) == '!') {
    return run(message);
  }
  return null;
}

function run(command) {
  var response = null
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
  }

  return response;
}

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
