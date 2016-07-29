var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
  //botRegex = /notarapper.gif/;
  botRegexAll = /!all/;
  /*
     botRegexI = /^I!$/;
     botRegexThat = /^I BELIEVE THAT!$/;
     botRegexWill = /^I BELIEVE THAT WE WILL!$/;
     botRegexWin = /^I BELIEVE THAT WE WILL WIN!$/;
     botRegexUSA = /USA/;
     botRegexAvatar = /^!avatar$/;

     if(request.text && botRegexI.test(request.text)) {
     console.log("I BELIEVE")
     this.res.writeHead(200);
     postMessage("I");
     this.res.end();
     }
     else if(request.text && botRegexThat.test(request.text)) {
     this.res.writeHead(200);
     postMessage("THAT");
     this.res.end();
     }
     else if(request.text && botRegexWill.test(request.text)) {
     this.res.writeHead(200);
     postMessage("WILL");
     this.res.end();
     }
     else if(request.text && botRegexWin.test(request.text)) {
     this.res.writeHead(200);
     postMessage("WIN");
     this.res.end();
     }
     else if(request.text && botRegexUSA.test(request.text)){
     this.res.writeHead(200);
     postMessage("USA");
     this.res.end();
     }
     else if(request.text && botRegexAvatar.test(request.text)){
     this.res.writeHead(200);
     postMessage("AVATAR");
     this.res.end();
     }
     */
  if(request.text && botRegexAll.test(request.text)) {
    console.log("tag all");
    this.res.writeHead(200);
    postMessage("tag all");
    this.res.end();
  }
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(key) {
  var botResponse, options, body, botReq;

  //botResponse = ' '

  if(key == 'AVATAR')
  {
    botResponse = ' ';
    body = {
      "bot_id" : botID,
      "text" : botResponse,
      "attachments" : [    {      "type"  : "image",      "url"   : "https://i.groupme.com/3535x5100.jpeg.85095c1e90e448df925f77c4b9992958"    }  ]
    };
  }
  else if (key == 'tag all'){
    botResponse = '@all';
    body = {
      "bot_id" : botID,
      "text" : botResponse,
      "attachments": [	{"loci": [ [0,4],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],	"type": "mentions",	"user_ids": ["11119940","7048172","11119925","11172454","14504480","11153362","10224713","11153363","11172453","14504481","11119938","14504482","9781134","778332"]	}]
        //"attachments" : [    {      "type"  : "image",      "url"   : "https://i.groupme.com/3535x5100.jpeg.85095c1e90e448df925f77c4b9992958"    }  ]
    };
  }
  else
  {
    if(key == 'I')
    {
      botResponse = 'I BELIEVE';
    }
    else if (key == 'THAT')
    {
      botResponse = 'I BELIEVE THAT WE';
    }
    else if (key == 'WILL')
    {
      botResponse = 'I BELIEVE THAT WE WILL WIN';
    }
    else if (key == 'WIN')
    {
      botResponse = 'I BELIEVE THAT WE WILL WIN';
    }
    else if (key == 'USA')
    {
      botResponse = 'U-S-A! U-S-A!';
    }


    body = {
      "bot_id" : botID,
      "text" : botResponse
    };
  }


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  /*

     body = {
     "bot_id" : botID,
     "text" : botResponse,
     "attachments" : [    {      "type"  : "image",      "url"   : "https://i.groupme.com/320x240.gif.bf49bb9422e94f9b9548d70b5e5eef11.large"    }  ]
     };
     */



  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
    if(res.statusCode == 202) {
      //neat
    } else {
      console.log('rejecting bad status code ' + res.statusCode);
    }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
