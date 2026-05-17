import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

const solvePolynomial = (problem) => {

  try {

    // 🔥 parse expression
    const parsed = parsePolynomial(problem);

    if (!parsed.expression) {
      return {
        success: false,
        message: "Invalid polynomial expression",
      };
    }

    // 🔥 expand expression
    const expanded = nerdamer
      .expand(parsed.expression)
      .toString();

    return {
      success: true,
      topic: "Polynomial Expansion",
      formula: "Bracket Expansion",

      steps: [
        `Original expression: ${problem}`,
        `Convert adjacent brackets into multiplication`,
        `Apply distributive law`,
        `Combine like terms`,
      ],

      answer: expanded,

      relatedTopics: [
        "Algebra",
        "Factorization",
        "Quadratic Expressions",
      ],
    };

  } catch (err) {

    console.error("Polynomial Solver Error:", err);

    return {
      success: false,
      message: "Invalid polynomial expression",
    };
  }
};

export default solvePolynomial;