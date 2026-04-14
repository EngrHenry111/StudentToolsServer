import { parseRatio } from "./ratioParser.js";
import { formatResponse } from "../../formatter.js";

const solveRatio = (problem) => {
  const parsed = parseRatio(problem);

  if (!parsed) return { error: "Unsupported ratio format" };

  const { total, r1, r2 } = parsed;

  const sum = r1 + r2;

  const part1 = (r1 / sum) * total;
  const part2 = (r2 / sum) * total;

  return formatResponse({
    topic: "Ratio",
    formula: "Share = (part / total ratio) × value",
    steps: [
      `Sum of ratio = ${r1} + ${r2} = ${sum}`,
      `First part = (${r1}/${sum}) × ${total} = ${part1}`,
      `Second part = (${r2}/${sum}) × ${total} = ${part2}`,
    ],
    answer: `${part1} and ${part2}`,
    relatedTopics: ["Proportion", "Fractions"],
  });
};

try {
  // logic
} catch (error) {
  console.error("Solver error:", error);
  return { error: "Solver failed" };
}
export default solveRatio;