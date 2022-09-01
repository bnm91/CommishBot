require("dotenv").config();

var bot = require("./bot.js");
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.send("CommishBot, reporting for duty.");
});

app.post("/", function (req, res) {
  bot.respond(req.body);
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Listening on port 5000...");
});
