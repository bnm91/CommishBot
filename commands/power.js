const matcher = /!power/;
const { Client } = require("espn-fantasy-football-api/node");
const {
  produceResponseObjectForText,
  produceImmediateResponse,
} = require("../helpers/utils");
const espnMembers = require("../constants/espnMembers").espnMembers;
const differenceInHours = require("date-fns/differenceInHours");
var fs = require("fs");
var util = require("util");
// var log_file = fs.createWriteStream(__dirname + "/power_debug.log", {
//   flags: "w",
// });
// var log_stdout = process.stdout;

// const logData = function (d) {
//   //
//   log_file.write(util.format(d) + "\n");
//   log_stdout.write(util.format(d) + "\n");
// };
function isGetPowerByYearAndWeek(splitCommand) {
  return (
    splitCommand.length === 3 &&
    !isNaN(splitCommand[1]) &&
    !isNaN(splitCommand[2]) &&
    splitCommand[2] < 2050 &&
    splitCommand[1] < 20
  );
}

const decimalPlaces = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

const squareMatrix = (X) => {
  let result = Array.from({ length:X.length }, () => (
    Array.from({ length:X.length }, ()=> 0.0)
 ))
  for(i of [...Array(X).keys()]) {
    for(j of [...Array(X).keys()]) {
      for(k of [...Array(X).keys()]) {
        result[i][j] += X[i][k] * X[k][j]
      }
    }
  }
  return result
}

const addMatrix = (X, Y) => {
  let result = Array.from({ length:X.length }, () => (
    Array.from({ length:X.length }, ()=> 0.0)
 ))

 for(i of [...Array(X).keys()]) {
  for(j of [...Array(X).keys()]) {
    result[i][j] = X[i][j] + Y[i][j]
  }
 }
 return result
}

const twoStepDominance = (X) => {
  const matrix = addMatrix(squareMatrix(X), X)
  const result = matrix.reduce((acc, curr) => {
    const sum = curr.reduce((acc1, curr1) => {
        return acc1 + curr1
    },0)
    return [...acc, sum]
  },[])
  return result
}

const powerPoints = (dominance, teams, week) => {
  let powerPoints = []
  const teamTuple = dominance.reduce((acc, curr, idx) => {
    return [...acc, [curr, teams[idx]]]
  }, [])
  teamTuple.forEach(([i, team]) => {
    const slicedScores = team.scores.slice(0, week)
    const slicedMov = team.mov.slice(0, week)
    const avgScore = slicedScores.reduce((acc,curr) => acc + curr, 0) / week
    const avgMov = slicedMov.reduce((acc,curr) => acc + curr, 0) / week
    const power = decimalPlaces((parseFloat(i)*0.8) + (parseFloat(avgScore) * 0.15) + (parseFloat(avgMov)* 0.05))
    powerPoints.push(power)
  })

  const powerTuple = powerPoints.reduce((acc, curr, idx) => {
    return [...acc, [curr, teams[idx].id]]
  }, [])
  // console.log(powerPoints)
  return powerTuple
}

function getPower(matchupWeek = 1, matchupYear = 2022) {
  if (matchupYear < 2018) {
    return produceImmediateResponse("Cant view activity before 2018");
  }
  let response = `AJ's POWER RANKINGS ${matchupYear} week ${matchupWeek}: \n`

  return new Promise(function (resolve, reject) {
    const myClient = new Client({
      leagueId: Number.parseInt(process.env.LEAGUE_ID),
    });
    myClient.setCookies({
      espnS2: process.env.ESPN_S2,
      SWID: process.env.SWID,
    });

    myClient
      .getExtendedLeagueInfo({
        seasonId: Number.parseInt(matchupYear),
        // scoringPeriodId: Number.parseInt(matchupWeek),
      })
      .then((teams) => {
        
        let winMatrix = [];
        let sortedTeams = [];
        sortedTeams = [...teams].sort((a, b) => {
          if (a.id < b.id) {
            return -1;
          }
          if (a.id > b.id) {
            return 1;
          }
          return 0;
        });

        sortedTeams.forEach((team) => {
          let wins = new Array(14).fill(0);

          const weekRangeMov= team.mov.slice(0, matchupWeek)
          const weekRangeSchedule = team.schedule.slice(0, matchupWeek)
          const teamTuple = weekRangeMov.reduce((acc, curr, idx) => {
            return [...acc, [curr, weekRangeSchedule[idx]]]
          }, [])
          
          teamTuple.forEach(([mov, opponent]) => {
            const opp = sortedTeams.findIndex(x => x.id === opponent.id)
            if (mov > 0) {
              wins[opp] += 1
            }
          });
          winMatrix.push(wins)
        });
        const dominanceMatrix = twoStepDominance(winMatrix)
        const powerRank = powerPoints(dominanceMatrix, sortedTeams, matchupWeek)
        const sortedRanks = [...powerRank].sort((a, b) => {
          if (a[0] > b[0]) {
            return -1;
          }
          if (a[0] < b[0]) {
            return 1;
          }
          return 0;
        });
        sortedRanks.forEach(([points, id], idx) => {
          const memberName = espnMembers.find(
            (member) => member.id === id
          ).name;
          response += `#${idx+1}: ${memberName} -- Dominance Points: ${points}\n`
        })
        console.log(response)
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
      "!power  # Shows power rankings for current week\n" +
      "!power {week} {year}  # view specific power rankings\n" +
      "!power help # return this message\n"
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
  if (command.trim() === "!power") {
    return getPower(matchupWeek, matchupYear);
  }
  if (splitCommand.length === 2 && splitCommand[1] === "help") {
    return helpMessage();
  }
  if (isGetPowerByYearAndWeek(splitCommand)) {
    matchupYear = splitCommand[2];
    matchupWeek = splitCommand[1];
    return getPower(matchupWeek, matchupYear);
  }
  return helpMessage();
}

exports.run = run;
exports.matcher = matcher;
