import { formatResponse } from "../../formatter.js";

const solveMixture = (problem) => {
  const match = problem.match(/(\d+).*?(\d+)%.*?(\d+).*?(\d+)%/);

  if (!match) {
    return { error: "Invalid mixture format" };
  }

  const v1 = Number(match[1]);
  const p1 = Number(match[2]);
  const v2 = Number(match[3]);
  const p2 = Number(match[4]);

  const total = v1 + v2;
  const concentration = (v1 * p1 + v2 * p2) / total;

  return {
    success: true,
    topic: "Mixture",
    formula: "C = (v1p1 + v2p2) / total",
    steps: [
      `Total = ${v1} + ${v2} = ${total}`,
      `(${v1}×${p1} + ${v2}×${p2}) / ${total}`,
      `= ${concentration}%`,
    ],
    answer: `${concentration}%`,
  };
};
export default solveMixture;