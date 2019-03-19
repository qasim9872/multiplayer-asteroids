const hrtimeMs = function() {
  let time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

function diff(num1, num2){
  return (num1 > num2)? num1-num2 : num2-num1
}

module.exports = {
  hrtimeMs,
  diff
};
