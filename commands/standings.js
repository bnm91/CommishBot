const matcher = /!standings/;
const { Client } = require("espn-fantasy-football-api/node");
const {
  produceResponseObjectForText,
  produceImmediateResponse,
} = require("../helpers/utils");
const espnMembers = require("../constants/espnMembers").espnMembers;
const differenceInHours = require("date-fns/differenceInHours");

function isGetStandingsByYear(splitCommand) {
  return (
    splitCommand.length === 2 &&
    !isNaN(splitCommand[1]) &&
    splitCommand[1] < 2050 &&
    splitCommand[1] > 2006
  );
}

function getStandings(matchupWeek = 3, matchupYear = 2021) {
  let response = `Year ${matchupYear} Standings:\n`;
  if (matchupYear < 2018) {
    return produceImmediateResponse("Cant view activity before 2018");
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
      .getTeamsAtWeek({
        seasonId: Number.parseInt(matchupYear),
        scoringPeriodId: Number.parseInt(matchupWeek),
      })
      .then((teams) => {
        // console.log("WAT TEAMS", teams)
        let sortedTeams = [];
        if ([...teams][0].finalStandingsPosition === 0) {
          sortedTeams = [...teams].sort((a, b) => {
            if (a.playoffSeed < b.playoffSeed) {
              return -1;
            }
            if (a.playoffSeed > b.playoffSeed) {
              return 1;
            }
            return 0;
          });
        } else {
          sortedTeams = [...teams].sort((a, b) => {
            if (a.finalStandingsPosition < b.finalStandingsPosition) {
              return -1;
            }
            if (a.finalStandingsPosition > b.finalStandingsPosition) {
              return 1;
            }
            return 0;
          });
        }
        sortedTeams.forEach((team) => {
          const memberName = espnMembers.find(
            (member) => member.id === team.id
          ).name;
          if (team.finalStandingsPosition === 1) {
            response += `#${
              team.finalStandingsPosition || team.playoffSeed
            } 👑${memberName} (${team.wins}-${team.losses}-${team.ties})👑\n`;
          } else if (team.finalStandingsPosition === 14) {
            response += `#${
              team.finalStandingsPosition || team.playoffSeed
            } 💩${memberName} (${team.wins}-${team.losses}-${team.ties})💩\n`;
          } else {
            response += `#${
              team.finalStandingsPosition || team.playoffSeed
            } ${memberName} (${team.wins}-${team.losses}-${team.ties})\n`;
          }
        });
        console.log(response);
        return resolve(produceResponseObjectForText(response));
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
      "!standings  # list standings of current season\n" +
      "!standings {year}  # view specific final standings in specific season\n" +
      "!standings help # return this message\n"
  );
}

function run(command, request) {
  const splitCommand = command.split(" ");
  let matchupYear = 2022;
  let matchupWeek = 1;

  const dateDiff =
    Math.floor(differenceInHours(new Date(), new Date(2022, 8, 1)) / (7 * 24)) |
    0;

  if (dateDiff >= 1) {
    matchupWeek = dateDiff;
  }
  if (command.trim() === "!standings") {
    return getStandings(matchupWeek, matchupYear);
  }
  if (splitCommand.length === 2 && splitCommand[1] === "help") {
    return helpMessage();
  }
  if (isGetStandingsByYear(splitCommand)) {
    const matchupYear = splitCommand[1];
    return getStandings(matchupWeek, matchupYear);
  }
  return helpMessage();
}

exports.run = run;
exports.matcher = matcher;
