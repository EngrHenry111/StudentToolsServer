import { parseSetTheory } from "../../mathEngine/setThreory/setParser.js";
import { formatResponse } from "../../formatter.js";

const solveSetTheory = (problem) => {
  console.log("📥 Set problem:", problem);

  const parsed = parseSetTheory(problem);

  console.log("🧠 Parsed:", parsed);

  if (!parsed) return { error: "Invalid set input" };

  let steps = [];
  let answer = 0;

  // 🔹 UNION
  if (
    parsed.a !== undefined &&
    parsed.b !== undefined &&
    parsed.intersection !== undefined
  ) {
    answer = parsed.a + parsed.b - parsed.intersection;

    steps = [
      "Use formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)",
      `${parsed.a} + ${parsed.b} - ${parsed.intersection}`,
      `Answer = ${answer}`,
    ];
  }

  // 🔹 COMPLEMENT
  else if (
    parsed.universal !== undefined &&
    parsed.a !== undefined
  ) {
    answer = parsed.universal - parsed.a;

    steps = [
      "Use complement: n(A') = n(U) - n(A)",
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