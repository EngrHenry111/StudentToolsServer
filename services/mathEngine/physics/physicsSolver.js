import { formatResponse } from "../../formatter.js";

const solvePhysics = (problem) => {
  const text = problem.toLowerCase();

  // F = ma
  const match = text.match(/mass (\d+).*acceleration (\d+)/);

  if (match) {
    const m = Number(match[1]);
    const a = Number(match[2]);

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

  return { error: "Unsupported physics problem" };
};

export default solvePhysics;