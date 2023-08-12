var matcher = /!draft/;

function run(command, request) {
  const countDownDate = new Date("Sept 5, 2023 20:00:00 GMT-0500").getTime();
  const now = new Date().getTime();
  const timeleft = countDownDate - now;

  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;

  const days = Math.floor(timeleft / MS_PER_DAY);
  const hours = Math.floor((timeleft % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((timeleft % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((timeleft % MS_PER_MINUTE) / MS_PER_SECOND);

  const text = `The draft is in ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  return {
    text: text,
  };
}
exports.run = run;
exports.matcher = matcher;
