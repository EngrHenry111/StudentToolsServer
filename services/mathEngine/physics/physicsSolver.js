import { formatResponse } from "../../formatter.js";

const solvePhysics = (problem) => {
  const text = problem.toLowerCase();

  // F = ma
  const massMatch = text.match(/mass\s*(is)?\s*(\d+)/);
const accelMatch = text.match(/acceleration\s*(is)?\s*(\d+)/);

if (massMatch && accelMatch) {
  const m = Number(massMatch[2]);
  const a = Number(accelMatch[2]);

  const force = m * a;

  return formatResponse({
    topic: "Physics",
    formula: "F = m × a",
    steps: [
      `Mass = ${m}`,
      `Acceleration = ${a}`,
      `Force = ${m} × ${a} = ${force}`,
    ],
    answer: `${force} N`,
  });
}

};

export default solvePhysics;