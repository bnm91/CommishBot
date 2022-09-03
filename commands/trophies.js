const matcher = /!trophies/;
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
  let lowScore = 9999;
  let lowScoreTeam = "";
  let highScore = -1;
  let highScoreTeam = "";
  let closeScore = 9999;
  let closeScoreWinner = "";
  let closeScoreLoser = "";
  let biggestBlowout = -1;
  let biggestBlowoutWinner = "";
  let biggestBlowoutLoser = "";

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
        matchups.forEach(({ homeTeamId, awayTeamId, homeScore, awayScore }) => {
          const homeMemberName = espnMembers.find(
            (member) => member.id === homeTeamId
          ).name;
          const awayMemberName = espnMembers.find(
            (member) => member.id === awayTeamId
          ).name;

          if (homeScore > highScore) {
            highScore = homeScore;
            highScoreTeam = homeMemberName;
          }
          if (homeScore < lowScore) {
            lowScore = homeScore;
            lowScoreTeam = homeMemberName;
          }
          if (awayScore > highScore) {
            highScore = awayScore;
            highScoreTeam = awayMemberName;
          }
          if (awayScore < lowScore) {
            lowScore = awayScore;
            lowScoreTeam = awayMemberName;
          }
          if (
            awayScore - homeScore !== 0 &&
            Math.abs(awayScore - homeScore) < closeScore
          ) {
            closeScore = Math.abs(awayScore - homeScore);
            if (awayScore - homeScore < 0) {
              closeScoreWinner = homeMemberName;
              closeScoreLoser = awayMemberName;
            } else {
              closeScoreWinner = awayMemberName;
              closeScoreLoser = homeMemberName;
            }
          }
          if (Math.abs(awayScore - homeScore) > biggestBlowout) {
            biggestBlowout = Math.abs(awayScore - homeScore);
            if (awayScore - homeScore < 0) {
              biggestBlowoutWinner = homeMemberName;
              biggestBlowoutLoser = awayMemberName;
            } else {
              biggestBlowoutWinner = awayMemberName;
              biggestBlowoutLoser = homeMemberName;
            }
          }
        });
        let response =
          `Week ${matchupWeek} ${matchupYear} Trophies:\n` +
          `- Lowest Score with ${lowScore} points: ${lowScoreTeam}\n` +
          `- Highest Score with ${highScore} points: ${highScoreTeam}\n` +
          `- ${closeScoreWinner} barely beat ${closeScoreLoser} by a margin of ${closeScore} points\n` +
          `- ${biggestBlowoutLoser} blown out by ${biggestBlowoutWinner} by a margin of ${biggestBlowout}`;

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
      "!trophies  # list trophies for previous week \n" +
      "!trophies {week}  # view specific week trophies in current season\n" +
      "!trophies {week} {year}  # view specific week trophies in specific season\n" +
      "!trophies help # return this message\n"
  );
}

function run(command, request) {
  const splitCommand = command.split(" ");
  let matchupYear = 2022;
  let matchupWeek = 2;
  if (command.trim() === "!trophies") {
    // Weeks between First Tuesday of season until now
    const dateDiff =
      Math.floor(
        differenceInHours(new Date(), new Date(2022, 8, 6)) / (7 * 24)
      ) | 0;

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
