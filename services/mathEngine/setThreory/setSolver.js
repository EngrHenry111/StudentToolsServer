import { parseSetProblem } from "./setParser";
import { formatResponse } from "../../formatter";


const solveSetTheory = (problem) => {
  const parsed = parseSetProblem(problem);

  if (!parsed) {
    return { error: "Unsupported set theory format" };
  }

  let steps = [];
  let answer;

  switch (parsed.type) {

    // 🔹 2 SETS
    case "two_sets": {
      const { A, B, intersection } = parsed;

      const union = A + B - intersection;

      steps = [
        `Formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`,
        `${A} + ${B} - ${intersection}`,
        `n(A ∪ B) = ${union}`,
      ];

      answer = union;
      break;
    }

    // 🔹 3 SETS
    case "three_sets": {
      const { A, B, C, AB, AC, BC, ABC } = parsed;

      const total = A + B + C - AB - AC - BC + ABC;

      steps = [
        `Formula: n(A ∪ B ∪ C) = A + B + C - AB - AC - BC + ABC`,
        `${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${ABC}`,
        `Total = ${total}`,
      ];

      answer = total;
      break;
    }

    // 🔹 COMPLEMENT
    case "complement": {
      const { U, A } = parsed;

      const complement = U - A;

      steps = [
        `Formula: n(A') = n(U) - n(A)`,
        `${U} - ${A} = ${complement}`,
      ];

      answer = complement;
      break;
    }

    default:
      return { error: "Unsupported set theory type" };
  }

  return formatResponse({
    topic: "Set Theory",
    formula: "Set Formulas",
    steps,
    answer,
    relatedTopics: [
      "Venn Diagrams",
      "Probability",
      "Logic",
    ],
  });
};

export default solveSetTheory;