import { parseSpeed } from "../../mathEngine/speed/speedParser.js";
import { formatResponse } from "../../formatter.js";

const solveSpeed = (problem) => {
  const parsed = parseSpeed(problem);

  if (!parsed) return { error: "Invalid speed problem" };

  let steps = [];
  let answer;

  if (parsed.type === "speed") {
    answer = parsed.distance / parsed.time;

    steps = [
      `Formula: Speed = Distance / Time`,
      `Distance = ${parsed.distance}`,
      `Time = ${parsed.time}`,
      `${parsed.distance} / ${parsed.time} = ${answer}`,
    ];
  }

  if (parsed.type === "distance") {
    answer = parsed.speed * parsed.time;

    steps = [
      `Formula: Distance = Speed × Time`,
      `Speed = ${parsed.speed}`,
      `Time = ${parsed.time}`,
      `${parsed.speed} × ${parsed.time} = ${answer}`,
    ];
  }

  return formatResponse({
    topic: "Speed",
    formula: "Speed = Distance / Time",
    steps,
    answer,
  });
};

export default solveSpeed;