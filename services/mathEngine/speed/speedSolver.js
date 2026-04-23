import { parseSpeed } from "../../mathEngine/speed/speedParser.js";
import { formatResponse } from "../../formatter.js";

const solveSpeed = (problem) => {
  const parsed = parseSpeed(problem);

  if (!parsed) return { error: "Invalid speed/motion problem" };

  let steps = [];
  let answer;

  // 🔹 SPEED = DISTANCE / TIME
  if (parsed.type === "speed") {
    if (parsed.time === 0) return { error: "Time cannot be zero" };

    answer = parsed.distance / parsed.time;

    steps = [
      "Formula: Speed = Distance / Time",
      `Distance = ${parsed.distance}`,
      `Time = ${parsed.time}`,
      `Speed = ${parsed.distance} / ${parsed.time}`,
      `Speed = ${answer}`,
    ];
  }

  // 🔹 DISTANCE = SPEED × TIME
  else if (parsed.type === "distance") {
    answer = parsed.speed * parsed.time;

    steps = [
      "Formula: Distance = Speed × Time",
      `Speed = ${parsed.speed}`,
      `Time = ${parsed.time}`,
      `Distance = ${parsed.speed} × ${parsed.time}`,
      `Distance = ${answer}`,
    ];
  }

  // 🔹 TIME = DISTANCE / SPEED
  else if (parsed.type === "time") {
    if (parsed.speed === 0) return { error: "Speed cannot be zero" };

    answer = parsed.distance / parsed.speed;

    steps = [
      "Formula: Time = Distance / Speed",
      `Distance = ${parsed.distance}`,
      `Speed = ${parsed.speed}`,
      `Time = ${parsed.distance} / ${parsed.speed}`,
      `Time = ${answer}`,
    ];
  }

  return formatResponse({
    topic: "Speed & Motion",
    formula: "S = D / T",
    steps,
    answer,
  });
};

export default solveSpeed;