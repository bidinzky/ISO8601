(function(ex) {
  const isoDuration = /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;

  let casualMatrix = {
    years: 365 * 24 * 60 * 60 * 1000,
    quarters: 91 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    minutes: 60 * 1000,
    seconds: 1000,
    milliseconds: 1
  }
  
  function parseInteger(string) {
    if (string == undefined || string === null || string === "") {
      return undefined;
    } else {
      return parseInt(string, 10);
    }
  }
  
  function parseMillis(fraction) {
    // Return undefined (instead of 0) in these cases, where fraction is not set
    if (fraction == undefined || fraction === null || fraction === "") {
      return undefined;
    } else {
      const f = parseFloat("0." + fraction) * 1000;
      return Math.floor(f);
    }
  }
  
  function extractISODuration(match) {
    const [
      s,
      yearStr,
      monthStr,
      weekStr,
      dayStr,
      hourStr,
      minuteStr,
      secondStr,
      millisecondsStr
    ] = match;
  
    const hasNegativePrefix = s[0] === "-";
  
    const maybeNegate = num => (num && hasNegativePrefix ? -num : num);
  
    return ({
        years: maybeNegate(parseInteger(yearStr)),
        months: maybeNegate(parseInteger(monthStr)),
        weeks: maybeNegate(parseInteger(weekStr)),
        days: maybeNegate(parseInteger(dayStr)),
        hours: maybeNegate(parseInteger(hourStr)),
        minutes: maybeNegate(parseInteger(minuteStr)),
        seconds: maybeNegate(parseInteger(secondStr)),
        milliseconds: maybeNegate(parseMillis(millisecondsStr))
      });
  }
  
  function normalize(obj) {
    let res = {};
    for(let k in obj){
      if(k != null && k != undefined && obj[k] != undefined && obj[k] != null) {
        res[k] = obj[k];
      }
    }
    return res;
  }
  
  function toMS(dur) {
    let own = 0;
    for(const ak in dur) {
      own += casualMatrix[ak] * dur[ak];
    }
    return own;
  }
  
  ex["TIME_TO_MS"] = function(s) {
    return toMS(normalize(extractISODuration(isoDuration.exec(s))));
  }
  ex["MS_TO_TIME"] = function(ms){
    return "PT"+(ms/1000).toFixed(3)+"S";
  }
})(window)

