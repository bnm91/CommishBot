var HTTP = require("http");
const { produceResponseObjectForText } = require("../helpers/utils");

var apiKey = process.env.API_KEY;

var matcher = /!giphy/;

function run(command, request) {
  var searchString = command.split(" ").slice(1).join(" ");

  var options = {
    host: "api.giphy.com",
    path:
      "/v1/gifs/search?q=" + encodeQuery(searchString) + "&api_key=" + apiKey,
  };

  return new Promise(function (resolve, reject) {
    try {
      var callback = function (response) {
        var str = "";

        response.on("data", function (chunck) {
          str += chunck;
        });

        response.on("end", function () {
          if (!(str && JSON.parse(str).data[0])) {
            resolve(produceResponseObjectForText("Couldn't find a gif 💩"));
          } else {
            var id = JSON.parse(str).data[0].id;
            var giphyURL = "https://i.giphy.com/" + id + ".gif";
            resolve(produceResponseObjectForText(giphyURL));
          }
        });
      };

      HTTP.request(options, callback).end();
    } catch (e) {
      reject(e);
    }
  });
}

function encodeQuery(query) {
  return query.replace(/\s/g, "+");
}

exports.run = run;
exports.matcher = matcher;
