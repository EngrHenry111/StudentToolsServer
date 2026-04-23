import { formatResponse } from "../../formatter.js";

const solvePhysics = (problem) => {
  const m = problem.match(/mass.*?(\d+)/);
  const a = problem.match(/acceleration.*?(\d+)/);

  if (!m || !a) {
    return { error: "Missing values" };
  }

  const mass = Number(m[1]);
  const acc = Number(a[1]);

  const force = mass * acc;

  return {
    success: true,
    topic: "Physics",
    formula: "F = m × a",
    steps: [
      `F = ${mass} × ${acc}`,
      `F = ${force}`,
    ],
    answer: `${force} N`,
  };
};

export default solvePhysics;