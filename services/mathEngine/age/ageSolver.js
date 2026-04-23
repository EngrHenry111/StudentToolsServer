import { formatResponse } from "../../formatter.js";

const solveAge = (problem) => {
  const nums = problem.match(/\d+/g);

  if (!nums || nums.length < 2) {
    return { error: "Invalid age input" };
  }

  const [a, b] = nums.map(Number);

  const diff = Math.abs(a - b);

  return {
    success: true,
    topic: "Age Problem",
    formula: "Difference = Older - Younger",
    steps: [
      `Difference = |${a} - ${b}|`,
      `= ${diff}`,
    ],
    answer: diff,
  };
};

export default solveAge;