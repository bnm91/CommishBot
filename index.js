require("dotenv").config();

const bot = require("./bot.js");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("CommishBot, reporting for duty."));

app.post("/groupme", (req, res) => bot.respond(req.body));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
