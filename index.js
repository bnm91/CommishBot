// var http, director, bot, router, server, port;

// http        = require('http');
// director    = require('director');
// bot         = require('./bot.js');

// router = new director.http.Router({
//   '/' : {
//     post: bot.respond,
//     get: ping
//   }
// });

// server = http.createServer(function (req, res) {
//   req.chunks = [];
//   req.on('data', function (chunk) {
//     req.chunks.push(chunk.toString());
//   });

//   router.dispatch(req, res, function(err) {
//     res.writeHead(err.status, {"Content-Type": "text/plain"});
//     res.end(err.message);
//   });
// });

// port = Number(process.env.PORT || 5000);
// server.listen(port);

// function ping() {
//   this.res.writeHead(200);
//   this.res.end("CommishBot, reporting for duty.");
// }

var bot = require('./bot.js');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', function (req, res) {
  res.send("CommishBot, reporting for duty.")
});

app.post('/', function (req, res) {
  bot.respond(req.body)
});

app.listen(process.env.PORT || 5000, function() {
  console.log("Listening on port 5000...")
});