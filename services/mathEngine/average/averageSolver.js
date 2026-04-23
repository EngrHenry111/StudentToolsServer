import { parseAverage } from "../../mathEngine/average/averageParser.js";
import { formatResponse } from "../../formatter.js";

const solveAverage = (problem) => {
  const parsed = parseAverage(problem);

  if (!parsed) return { error: "Invalid average problem" };

  const sum = parsed.values.reduce((a, b) => a + b, 0);
  const avg = sum / parsed.values.length;

  return formatResponse({
    topic: "Average",
    formula: "Mean = Total / Count",
    steps: [
      `Values: ${parsed.values.join(", ")}`,
      `Sum = ${sum}`,
      `Count = ${parsed.values.length}`,
      `Average = ${sum} / ${parsed.values.length}`,
      `Average = ${avg}`,
    ],
    answer: avg,
  });
};

export default solveAverage;