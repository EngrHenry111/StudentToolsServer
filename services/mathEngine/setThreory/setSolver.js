import { parseSetProblem } from "../../mathEngine/setThreory/setParser.js";
import { formatResponse } from "../../formatter.js";

const solveSetTheory = (problem) => {
  const parsed = parseSetTheory(problem);

  if (!parsed) return { error: "Invalid set input" };

  let steps = [];
  let answer = 0;

  // 🔹 2 SETS
  if (parsed.a && parsed.b && parsed.intersection) {
    answer = parsed.a + parsed.b - parsed.intersection;

    steps = [
      "Use formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
      `${parsed.a} + ${parsed.b} - ${parsed.intersection}`,
      `Answer = ${answer}`,
    ];
  }

  // 🔹 COMPLEMENT
  else if (parsed.universal && parsed.a) {
    answer = parsed.universal - parsed.a;

    steps = [
      "Use complement formula: n(A') = n(U) - n(A)",
      `${parsed.universal} - ${parsed.a}`,
      `Answer = ${answer}`,
    ];
  }

  else {
    return { error: "Unsupported set theory format" };
  }

  return formatResponse({
    topic: "Set Theory",
    formula: "n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
    steps,
    answer,
    relatedTopics: ["Probability"],
  });
};

export default solveSetTheory;