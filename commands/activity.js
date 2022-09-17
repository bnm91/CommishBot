const matcher = /!activity/;
const { Client } = require("espn-fantasy-football-api/node");
const {
  produceResponseObjectForText,
  produceImmediateResponse,
} = require("../helpers/utils");
const espnMembers = require("../constants/espnMembers").espnMembers;

function getActivity() {

  const getActivityResponse = (teamId, teamIds, action, player, bidAmount) => {
    
    const memberName = espnMembers.find(
      (member) => member.id === teamId
    ).name;
    
    if(action === 'FA ADDED') {
      return `${memberName} added ${player} from Free Agency\n`
    }
    if(action === 'DROPPED') {
      return `${memberName} dropped ${player}\n`
    }
    if(action === 'TRADED') {
      const tradedTo = espnMembers.find(
        (member) => member.id === teamIds.to
      ).name;
      return `${memberName} traded ${player} to ${tradedTo}\n`
    }
    if(action === 'WAIVER ADDED') {
      return `${memberName} added ${player} from the waivers for $${bidAmount}\n`
    }
  }
  
  return new Promise(function (resolve, reject) {
    const myClient = new Client({
      leagueId: Number.parseInt(process.env.LEAGUE_ID),
    });
    myClient.setCookies({
      espnS2: process.env.ESPN_S2,
      SWID: process.env.SWID,
    });

    myClient
      .getRecentActivity({
        seasonId: 2022,
      })
      .then((data) => {
        const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).valueOf()
        let strResponse = 'League Activity in past 24 hours:\n'
        for(const activity of data) {
          for(const action of activity) {
            if(action.date >= yesterday) {
              strResponse += getActivityResponse(
                action.team.id, 
                action.ids, 
                action.action, 
                action.player.playerPoolEntry ? action.player.playerPoolEntry.player.fullName : action.player.player.fullName,
                action.bidAmount
              )
            }
          }
        }
        return resolve(produceResponseObjectForText(strResponse));
      })
      .catch((err) => {
        console.error(err);
        return reject(
          produceResponseObjectForText(
            "API returned an error. You did something stupid or it's broken. Try again later"
          )
        );
      });
  });
}

function helpMessage() {
  return produceImmediateResponse(
    "Usage:\n" +
      "!activity  # returns recent league transactions\n"
  );
}

function run(command, request) {
  const splitCommand = command.split(" ");
  if (command.trim() === "!activity") {
    return getActivity();
  }
  if (splitCommand.length === 2 && splitCommand[1] === "help") {
    return helpMessage();
  }
  return helpMessage();
}

exports.run = run;
exports.matcher = matcher;
