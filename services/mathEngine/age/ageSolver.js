import { parseAge } from "../../mathEngine/age/ageParser.js";
import { formatResponse } from "../../formatter.js";

const solveAge = (problem) => {
  const parsed = parseAge(problem);

  if (!parsed) return { error: "Invalid age problem" };

  const diff = Math.abs(parsed.a - parsed.b);

  return formatResponse({
    topic: "Age Problem",
    formula: "Difference = Older - Younger",
    steps: [
      `First age = ${parsed.a}`,
      `Second age = ${parsed.b}`,
      `Difference = ${parsed.a} - ${parsed.b}`,
      `Difference = ${diff}`,
    ],
    answer: diff,
  });
};

export default solveAge;