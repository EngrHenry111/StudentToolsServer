import { formatResponse } from "../../formatter.js";

const solveIndices = (problem) => {
  const match = problem.match(/(\d+)\^(\d+)/);

  if (!match) return { error: "Invalid indices format" };

  const base = Number(match[1]);
  const power = Number(match[2]);

  const result = base ** power;

  return formatResponse({
    topic: "Indices",
    formula: "a^n",
    steps: [
      `${base}^${power} = ${base} × ${base}...`,
      `= ${result}`,
    ],
    answer: result,
    relatedTopics: ["Algebra"],
  });
};

export default solveIndices;