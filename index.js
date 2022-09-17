require("dotenv").config();

var bot = require("./bot.js");
const express = require("express");
const app = express();
var power = require("./commands/power");
app.use(express.json());

app.get("/", function (req, res) {
  // standings.run("!standings 5 2017").then((resp) => {
  //   res.send(standings.run("!standings 5 2017"));
  // });
  res.send(power.run("!power 1 2022"));
});

app.post("/", function (req, res) {
  bot.respond(req.body);
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Listening on port 5000...");
});
