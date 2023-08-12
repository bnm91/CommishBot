const fetch = require("node-fetch");
var botId = process.env.BOT_ID;

var commands = {
  all: require("./commands/all"),
  flip: require("./commands/flip"),
  ping: require("./commands/ping"),
  pins: require("./commands/pins"),
  roll: require("./commands/roll"),
  draft: require("./commands/draft"),
  help: require("./commands/help"),
  insult: require("./commands/insult"),
  scores: require("./commands/scores"),
  closestScores: require("./commands/closestScores"),
  trophies: require("./commands/trophies"),
  giphy: require("./commands/giphy"),
  standings: require("./commands/standings"),
  activity: require("./commands/activity"),
  power: require("./commands/power"),
  chat: require("./commands/chat"),
};

/**
 * Extracts request message and responds if necessary.
 * Send request to GroupMe API to post message on bot's behalf
 */
async function respond(request) {
  const { text: message } = request;

  if (message.charAt(0) === "!") {
    const commandKey = message.split(" ")[0].substring(1); // Extract command key
    const command = commands[commandKey];

    if (command && message.match(command.matcher) !== null) {
      const response = await command.run(message, request);
      if (response) await sendHttpRequest(response);
    }
  }
}

async function sendHttpRequest(response) {
  response.bot_id = botId;
  const url = "https://api.groupme.com/v3/bots/post";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };

  const res = await fetch(url, options);

  if (res && res.status !== 202) {
    const error = new Error(`rejecting bad status code ${res.status}`);
    console.error(error);
    throw error;
  }
}

module.exports = {
  respond,
};
