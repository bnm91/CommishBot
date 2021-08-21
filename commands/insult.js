var insultGenerator = require('insultgenerator');

var cached = require('../cached');

var matcher = /!fuckyou(s|\s.*)/;

function run(command, request) {
  if (request.attachments !== undefined) {
    var usersToInsult = [];
    for (i = 0; i < request.attachments.length; i++) {
      if (request.attachments[i].type === 'mentions') {
        usersToInsult = request.attachments[i].user_ids;
        break;
      }
    }
    if (usersToInsult.length > 0) {
      var attachments = createUserMentions(usersToInsult);
      return new Promise(function(resolve, reject) {
        insultGenerator(function(insult) {
          resolve({
            'text' : attachments[1] + ' ' + insult,
            'attachments': [attachments[0]]
          });
        });
      });
    }
  }

  return new Promise(function(resolve, reject) {
    insultGenerator(function(insult) {
      resolve({
        'text' : insult
      });
    });
  });
}

/**
 * Creates a map of userIds to member objects
 * @private
 */
function createMemberMap() {
  var membersMap = {};
  for (var member in cached.members) {
    membersMap[cached.members[member].userId] = cached.members[member];
  }
  return membersMap;
}


/**
 * Provides all necessary data to mention a group of users at
 * the beginning of a message.
 * @param usersToMention an array of user ids
 * @returns an Array with two elements:
 *    1. The "mentions" attachment object
 *    2. The text to prefix the message
 * @private
 */
function createUserMentions(usersToMention) {
  var membersMap = createMemberMap();
  var mentionText = '';
  var mentionAttachment = {
      'loci': [],
      'type': 'mentions',
      'user_ids': []
  };

  var currentLoci = 0;
  for (var i = 0; i < usersToMention.length; i++) {
    var user = membersMap[usersToMention[i]];
    if (user === undefined) {
      // don't fail just because a user isn't recognised
      console.log('User ' + usersToMention[i] + ' not recognised');
      continue;
    }

    mentionText +=  '@' + user.nickname + ' ';
    mentionAttachment.user_ids.push(usersToMention[i]);
    mentionAttachment.loci.push(
      [currentLoci, currentLoci + user.nickname.length + 1 /* length of @ sign */]);

    currentLoci += user.nickname.length + 2 /* length of space + @ sign */;
  }

  return [mentionAttachment, mentionText.trim()];
}


exports.run = run;
exports.matcher = matcher;
