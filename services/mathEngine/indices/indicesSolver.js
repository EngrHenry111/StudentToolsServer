import { formatResponse } from "../../formatter.js";

// Previously only accepted the literal symbol format "2^5" — a real
// sentence like "Evaluate 2 to the power of 5" has no "^" at all and
// never matched. Fix: also recognize common word phrasings.
const solveIndices = (problem) => {
  const text = problem.toLowerCase();

  let match = text.match(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/);

  if (!match) {
    match = text.match(/(\d+(?:\.\d+)?)\s*(?:to the power of|raised to the power of|raised to|power)\s*(\d+(?:\.\d+)?)/);
  }

  if (!match) return { error: "Invalid indices format" };

  const base = Number(match[1]);
  const power = Number(match[2]);

  const result = base ** power;

  return formatResponse({
    topic: "Indices",
    formula: "a^n",
    steps: [
      power >= 1 && power <= 6
        ? `${base}^${power} = ${Array(power).fill(base).join(" × ")}`
        : `${base}^${power}`,
      `= ${result}`,
    ],
    answer: result,
    relatedTopics: ["Algebra"],
  });
};

export default solveIndices;
