// Previously this guessed the problem type purely from which WORDS
// appeared ("speed" → assume find-distance, "km"/"distance" → assume
// find-speed) — but "distance" appears in BOTH kinds of problems (both
// "find the distance" AND "given the distance, find the speed" mention
// the word "distance"), so it frequently guessed backwards, computing
// speed/time when it should have computed speed*time. Fix: detect each
// quantity from its actual UNIT (km/h = a speed value, bare km = a
// distance value, hours/minutes = a time value), and separately detect
// what's actually being asked for.
export const parseSpeed = (problem) => {
  const text = problem.toLowerCase();

  const speedMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:km\/h|kmph|kph|mph|m\/s)/);
  const timeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|minutes?|mins?|seconds?|secs?)/);
  // negative lookahead avoids matching the "km" inside "km/h" as if it
  // were a bare distance value
  const distanceMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometres?|kilometers?|metres?|meters?)\b(?!\/)/);

  const speed = speedMatch ? Number(speedMatch[1]) : null;
  const time = timeMatch ? Number(timeMatch[1]) : null;
  const distance = distanceMatch ? Number(distanceMatch[1]) : null;

  const asksFor = (word) => text.includes(`find ${word}`) || text.includes(`find the ${word}`) || text.includes(`${word} covered`) || text.includes(`calculate ${word}`);

  if ((asksFor("distance") || (speed !== null && time !== null && distance === null)) && speed !== null && time !== null) {
    return { type: "distance", speed, time };
  }

  if ((asksFor("speed") || (distance !== null && time !== null && speed === null)) && distance !== null && time !== null) {
    return { type: "speed", distance, time };
  }

  if ((asksFor("time") || (distance !== null && speed !== null && time === null)) && distance !== null && speed !== null) {
    return { type: "time", distance, speed };
  }

  return null;
};
