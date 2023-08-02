const { Configuration, OpenAIApi } = require("openai");
const {
  produceResponseObjectForText,
  produceImmediateResponse,
} = require("../helpers/utils");
var matcher = /!chat/;

function run(command, request) {
  var chatString = command.split(" ").slice(1).join(" ");

  if (chatString.length) {
    return new Promise(function (resolve, reject) {
      try {
        const configuration = new Configuration({
          apiKey: process.env.OPEN_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        openai
          .createChatCompletion({
            model: "gpt-3.5-turbo",
            max_tokens: 250,
            messages: [
              {
                role: "system",
                content:
                  "You are a witty, intelligent, funny, assistant with a personality close to Don Rickles",
              },
              {
                role: "user",
                content: chatString,
              },
            ],
          })
          .then((completion) => {
            const responseString =
              completion.data?.choices[0]?.message?.content;
            return resolve(
              produceResponseObjectForText(
                responseString || "Talk to AJ something fucked up"
              )
            );
          })
          .catch((e) => {
            console.error(e);
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  } else {
    return produceImmediateResponse("How did you get here dumb dumb");
  }
}

exports.run = run;
exports.matcher = matcher;
