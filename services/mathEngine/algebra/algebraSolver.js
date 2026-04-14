import { parseLinearEquation } from "./algebraParser.js";
import { formatResponse } from "../../formatter.js";

const solveAlgebra = (problem) => {
  const parsed = parseLinearEquation(problem);

  if (!parsed) {
    return { error: "Unsupported algebra format" };
  }

  let steps = [];
  let answer;

  switch (parsed.type) {

    // 🔹 ax + b = c OR ax - b = c
    case "ax_plus_b": {
      const { a, b, c } = parsed;

      if (a === 0) {
        return { error: "Coefficient of x cannot be 0" };
      }

      const step1 = c - b;
      const x = step1 / a;

      steps = [
        `Given: ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`,
        `Move constant: ${a}x = ${step1}`,
        `Divide both sides by ${a}: x = ${x}`,
      ];

      answer = `x = ${x}`;
      break;
    }

    // 🔹 ax = c
    case "ax": {
      const { a, c } = parsed;

      if (a === 0) {
        return { error: "Coefficient of x cannot be 0" };
      }

      const x = c / a;

      steps = [
        `Given: ${a}x = ${c}`,
        `Divide both sides by ${a}`,
        `x = ${x}`,
      ];

      answer = `x = ${x}`;
      break;
    }

    // 🔹 x/n + b = c
    case "x_div_n_plus_b": {
      const { n, b, c } = parsed;

      const step1 = c - b;
      const x = step1 * n;

      steps = [
        `Given: x/${n} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`,
        `Move constant: x/${n} = ${step1}`,
        `Multiply both sides by ${n}: x = ${x}`,
      ];

      answer = `x = ${x}`;
      break;
    }

    // 🔹 x/n = c
    case "x_div_n": {
      const { n, c } = parsed;

      const x = c * n;

      steps = [
        `Given: x/${n} = ${c}`,
        `Multiply both sides by ${n}`,
        `x = ${x}`,
      ];

      answer = `x = ${x}`;
      break;
    }

    default:
      return { error: "Unsupported algebra type" };
  }

  return formatResponse({
    topic: "Algebra",
    formula: "Linear Equation",
    steps,
    answer,
    relatedTopics: [
      "Quadratic Equations",
      "Simultaneous Equations",
      "Factorization",
    ],
  });
};



export default solveAlgebra;