const matcher = /!closestScores/;
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

function getMatchups(matchupWeek = 1, matchupYear = 2022) {
  let response = `Week ${matchupWeek} ${matchupYear} Closest Scores:\n`;
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

          if (matchup.awayTeamId) {
            const diffScore = matchup.awayScore - matchup.homeScore;

            if (
              (-16 < diffScore && diffScore <= 0) ||
              (0 <= diffScore && diffScore < 16)
            ) {
              // Add scores to response
              response =
                response +
                `${homeMemberName}: ${matchup.homeScore} --- ${awayMemberName}: ${matchup.awayScore}\n`;
            }
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
      "!closestScores  # list closest scores of current week (within 16 points)\n" +
      "!closestScores {week}  # view specific week scores in current season\n" +
      "!closestScores {week} {year}  # view specific score in specific season\n" +
      "!closestScores help # return this message\n"
  );
}

function run(command, request) {
  const splitCommand = command.split(" ");
  let matchupYear = 2022;
  let matchupWeek = 1;
  if (command.trim() === "!closestScores") {
    // Weeks between First Tuesday of season until now
    const dateDiff =
      Math.floor(
        differenceInHours(new Date(), new Date(2022, 8, 6)) / (7 * 24)
      ) | 1;

    if (dateDiff >= 0) {
      matchupWeek = dateDiff;
    }
    return getMatchups(matchupWeek, matchupYear);
  }
  if (splitCommand.length === 2 && splitCommand[1] === "help") {
    return helpMessage();
  }
  if (isGetMatchupByWeek(splitCommand)) {
    matchupWeek = splitCommand[1];
    return getMatchups(matchupWeek, matchupYear);
  }
  if (isGetMatchupByWeekAndYear(splitCommand)) {
    matchupYear = splitCommand[2];
    matchupWeek = splitCommand[1];
    return getMatchups(matchupWeek, matchupYear);
  }
  return helpMessage();
}

exports.run = run;
exports.matcher = matcher;
