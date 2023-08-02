const { Configuration, OpenAIApi } = require("openai");
var matcher = /!chat/;

function run(command, request) {
  var chatString = command.split(" ").slice(1).join(" ");

  if (chatString.length) {
    return new Promise(function (resolve, reject) {
      try {
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        // const completion = await
        openai
          .createCompletion({
            model: "gpt-3.5-turbo",
            prompt: chatString,
          })
          .then((completion) => {
            const responseString = completion.data?.choices[0]?.text
              ? completion.data.choices[0].text
              : "Talk to AJ something fucked up";
            return resolve(produceResponseObjectForText(responseString));
          });
      } catch (e) {
        reject(e);
      }
    });
  } else {
    return {
      text: "How did you get here? Try again.",
    };
  }
}

exports.run = run;
exports.matcher = matcher;
