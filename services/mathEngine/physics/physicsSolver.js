import { formatResponse } from "../../formatter.js";

const solvePhysics = (problem) => {
  const text = problem.toLowerCase();

  // 🔥 FORCE = MASS × ACCELERATION
  const forceMatch = text.match(/mass.*?(\d+).*?acceleration.*?(\d+)/);

  if (forceMatch) {
    const mass = Number(forceMatch[1]);
    const acceleration = Number(forceMatch[2]);
    const force = mass * acceleration;

    return formatResponse({
      topic: "Physics",
      formula: "F = m × a",
      steps: [
        `Mass = ${mass}`,
        `Acceleration = ${acceleration}`,
        `Force = mass × acceleration`,
        `F = ${mass} × ${acceleration} = ${force}`,
      ],
      answer: `${force} N`,
      relatedTopics: ["Motion", "Energy"],
    });
  }

  return { error: "Unsupported physics problem" };
};

export default solvePhysics;