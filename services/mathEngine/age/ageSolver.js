import { parseAge } from "../../mathEngine/age/ageParser.js";
import { formatResponse } from "../../formatter.js";

const solveAge = (problem) => {
  const parsed = parseAge(problem);

  if (!parsed) return { error: "Invalid age problem" };

  if (parsed.type === "relative") {
    const { delta, direction, base } = parsed;
    const result = direction === "older" ? base + delta : base - delta;

    return formatResponse({
      topic: "Age Problem",
      formula: direction === "older" ? "Age = Base + Difference" : "Age = Base - Difference",
      steps: [
        `Known age = ${base}`,
        `The other person is ${delta} years ${direction}`,
        direction === "older"
          ? `Age = ${base} + ${delta} = ${result}`
          : `Age = ${base} - ${delta} = ${result}`,
      ],
      answer: result,
    });
  }

  // Fallback: two ages given directly
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
