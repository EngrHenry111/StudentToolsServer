import { parsePhysics } from "../../mathEngine/physics/physicsParser.js";
import { formatResponse } from "../../formatter.js";


const solvePhysics = (problem) => {
  const parsed = parsePhysics(problem);

  if (!parsed) return { error: "Invalid physics problem" };

  let steps = [];
  let answer;

  if (parsed.type === "force") {
    answer = parsed.mass * parsed.acceleration;

    steps = [
      `Formula: F = m × a`,
      `Mass (m) = ${parsed.mass}`,
      `Acceleration (a) = ${parsed.acceleration}`,
      `F = ${parsed.mass} × ${parsed.acceleration}`,
      `F = ${answer} N`,
    ];
  }

  return formatResponse({
    topic: "Physics",
    formula: "F = m × a",
    steps,
    answer,
  });
};

export default solvePhysics;