const matcher = /!scores/;
const { Client } = require("espn-fantasy-football-api/node");
const {
  produceResponseObjectForText,
  produceImmediateResponse,
} = require("../helpers/utils");
const espnMembers = require("../constants/espnMembers").espnMembers;
const differenceInHours = require("date-fns/differenceInHours");

function isGetMatchupByWeek(splitCommand) {
  return (
    splitCommand.length === 2 && !isNaN(splitCommand[1]) && splitCommand[1] < 20
  );
}

function isGetMatchupByWeekAndYear(splitCommand) {
  return (
    splitCommand.length === 3 &&
    !isNaN(splitCommand[1]) &&
    !isNaN(splitCommand[2]) &&
    splitCommand[2] < 2050 &&
    splitCommand[1] < 20
  );
}

function getMatchup(matchupWeek, matchupYear) {
  let response = `Week ${matchupWeek} ${matchupYear} Scoring:\n`;
  console.log(matchupYear, matchupWeek);
  return new Promise(function (resolve, reject) {
    const myClient = new Client({
      leagueId: Number.parseInt(process.env.LEAGUE_ID),
    });
    myClient.setCookies({
      espnS2: process.env.ESPN_S2,
      SWID: process.env.SWID,
    });

    myClient
      .getBoxscoreForWeek({
        seasonId: Number.parseInt(matchupYear),
        matchupPeriodId: Number.parseInt(matchupWeek),
        scoringPeriodId: Number.parseInt(matchupWeek),
      })
      .then((matchups) => {
        matchups.forEach((matchup) => {
          const homeMemberName = espnMembers.find(
            (member) => member.id === matchup.homeTeamId
          ).name;
          const awayMemberName = espnMembers.find(
            (member) => member.id === matchup.awayTeamId
          ).name;

          // Add scores to response
          response =
            response +
            `${homeMemberName}: ${matchup.homeScore} --- ${awayMemberName}: ${matchup.awayScore}\n`;
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
      "!scores  # list scores of current week\n" +
      "!scores {week}  # view specific week score in current season\n" +
      "!scores {week} {year}  # view specific score in specific week\n" +
      "!scores help # return this message\n"
  );
}

function run(command, request) {
  const splitCommand = command.split(" ");
  let matchupYear = 2021;
  let matchupWeek = 1;

  if (command.trim() === "!scores") {
    // Weeks between First Tuesday of season until now
    const dateDiff =
      Math.floor(
        differenceInHours(new Date(), new Date(2021, 7, 31)) / (7 * 24)
      ) | 0;

    if (dateDiff >= 0) {
      matchupWeek = dateDiff;
    }
    return getMatchup(matchupWeek, matchupYear);
  }
  if (splitCommand.length === 2 && splitCommand[1] === "help") {
    return helpMessage();
  }
  if (isGetMatchupByWeek(splitCommand)) {
    matchupWeek = splitCommand[1];
    return getMatchup(matchupWeek, matchupYear);
  }
  if (isGetMatchupByWeekAndYear(splitCommand)) {
    matchupYear = splitCommand[2];
    matchupWeek = splitCommand[1];
    return getMatchup(matchupWeek, matchupYear);
  }
  return helpMessage();
}

exports.run = run;
exports.matcher = matcher;
