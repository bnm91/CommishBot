// var ffId = process.env.FF_ID;

// var FFNerd = require('fantasy-football-nerd');
// var ff = new FFNerd({ api_key: ffId });

// var matcher = /!bye(\s.*)/;

// function run(command, request) {
//   var byeWeek;
//   var teams = "";
//   if (command.length > 4 && command.startsWith('!bye ')) {
//     byeWeek = command.slice(4).replace(/\s/g, '');
//     if (isNaN(byeWeek) || byeWeek < 4 || byeWeek > 13) {
//       return new Promise(function(resolve, reject) {
//         resolve({
//           'text' : 'Enter a valid bye week'
//         });
//       });
//     } else {
//       var userByeWeek = parseInt(byeWeek);
//       var userPick = "Bye Week " + userByeWeek;
//       return new Promise(function(resolve, reject) {
//         ff.byes(function(byes) {
//           for (var key in byes) {
//             if (key.toString() == userPick) {
//               var obj = byes[key];
//               var teamKey = 'team';
//               for (var temp in obj) {
//                 var teamStr = JSON.stringify(obj[temp]['team']).replace(/\"/g, "");
//                 teams += teamStr + ' ';
//               }
//             }
//           }
//           resolve({
//             'text' : teams
//           });
//         });
//       });
//     }
//   }
// }

// exports.run = run;
// exports.matcher = matcher;
