var cached = require('../cached');

var matcher = /!all(\s.*)/;

function run(command, request) {
  var messageToAll = '';
  if (command.length > 4 && command.startsWith('!all ')) {
    messageToAll = command.slice(4);
  }

  userIds = [];
  for (i = 0; i < cached.members.length; i++) {
    member = cached.members[i];
    userIds.push(member.userId);
  }

  return {
    'text' : '@all' + messageToAll,
    'attachments': [
      {
        'loci': Array(userIds.length).fill([0, 4]),
        'type': 'mentions',
        'user_ids': userIds
      }
    ]
  };
}

exports.run = run;
exports.matcher = matcher;
