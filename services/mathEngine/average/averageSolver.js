import { formatResponse } from "../../formatter.js";

const solveAverage = (problem) => {
  const numbers = problem.match(/\d+/g)?.map(Number);

  if (!numbers || numbers.length < 2) {
    return { error: "Invalid average input" };
  }

  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;

  return formatResponse({
    topic: "Average",
    formula: "Average = Sum / Count",
    steps: [
      `Numbers: ${numbers.join(", ")}`,
      `Sum = ${sum}`,
      `Divide by ${numbers.length}`,
      `Average = ${avg}`,
    ],
    answer: avg,
    relatedTopics: ["Percentage"],
  });
};

export default solveAverage;