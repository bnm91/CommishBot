const HTTPS = require("https");
const botId = process.env.BOT_ID;

const commands = [
  require("./commands/all"),
  require("./commands/flip"),
  require("./commands/ping"),
  require("./commands/pins"),
  require("./commands/roll"),
  require("./commands/draft"),
  require("./commands/help"),
  require("./commands/scores"),
  require("./commands/closestScores"),
  require("./commands/insult"),
  require("./commands/giphy"),
  require("./commands/standings"),
  require("./commands/trophies"),
  require("./commands/activity"),
  require("./commands/power"),
  require("./commands/chat"),
];

/**
 * Extracts request message and responds if necessary.
 */
const respond = (request) => {
  const message = request.text;
  let response = null;

  if (message.startsWith("!")) {
    const command = commands.find((command) => message.match(command.matcher));
    if (command) {
      response = command.run(message, request);
    }
  }

  send(Promise.resolve(response));
};

/**
 * Send request to GroupMe API to post message on bot's behalf
 * @private
 */
const send = (responsePromise) => {
  responsePromise
    .then((response) => {
      console.log(
        "about to send message to groupme: " + JSON.stringify(response)
      );
      sendHttpRequest(response);
    })
    .catch((error) => {
      console.error(
        "There was an error processing the request: " + JSON.stringify(error)
      );
    });
};

const sendHttpRequest = (response) => {
  if (response !== null) {
    response.bot_id = botId;
    const options = {
      hostname: "api.groupme.com",
      path: "/v3/bots/post",
      method: "POST",
    };

    const req = HTTPS.request(options, (res) => {
      if (res.statusCode != 202) {
        console.log("rejecting bad status code " + res.statusCode);
        console.log(res);
      }
    });

    req.on("error", (err) =>
      console.log("error posting message " + JSON.stringify(err))
    );
    req.on("timeout", (err) =>
      console.log("timeout posting message " + JSON.stringify(err))
    );

    req.end(JSON.stringify(response));
  }
};

module.exports = {
  respond,
};
