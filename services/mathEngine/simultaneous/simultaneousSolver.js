import { formatResponse } from "../../formatter.js";

const solveSimultaneous = (problem) => {
  const text = problem.replace(/\s+/g, "");

  // Example: 2x+3y=13, x-y=1
  const match = text.match(
    /(\d*)x([+-]\d*)y=(\d+).*(\d*)x([+-]\d*)y=(\d+)/
  );

  if (!match) return { error: "Invalid simultaneous equation" };

  const a1 = Number(match[1] || 1);
  const b1 = Number(match[2]);
  const c1 = Number(match[3]);

  const a2 = Number(match[4] || 1);
  const b2 = Number(match[5]);
  const c2 = Number(match[6]);

  // Elimination
  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return { error: "No unique solution" };
  }

  const x = (c1 * b2 - c2 * b1) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  return formatResponse({
    topic: "Simultaneous Equations",
    formula: "Elimination Method",
    steps: [
      `Equation 1: ${a1}x + ${b1}y = ${c1}`,
      `Equation 2: ${a2}x + ${b2}y = ${c2}`,
      `Determinant = ${determinant}`,
      `Solve using elimination`,
      `x = ${x}, y = ${y}`,
    ],
    answer: `x = ${x}, y = ${y}`,
  });
};

export default solveSimultaneous;