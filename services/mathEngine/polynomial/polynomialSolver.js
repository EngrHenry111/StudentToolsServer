import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

const solvePolynomial = (problem) => {

  try {

    // 🔥 Parse
    const parsed = parsePolynomial(problem);

    if (!parsed.expression) {
      return {
        success: false,
        message: "Invalid polynomial expression",
      };
    }

    // 🔥 Normalize powers
    const normalized = parsed.expression
      .replace(/\^/g, "^");

    // 🔥 Expand
    const expanded = nerdamer
      .expand(normalized)
      .toString();

    // 🔥 Simplify
    const simplified = nerdamer(expanded)
      .toString();

    return {

      success: true,

      topic: "Polynomial Expansion",

      formula: "Bracket Expansion",

      steps: [

        `Original expression: ${problem}`,

        `Convert adjacent brackets into multiplication`,

        `Apply distributive property`,

        `Combine like terms`,

      ],

      answer: simplified,

      relatedTopics: [
        "Algebra",
        "Quadratic Expressions",
        "Factorization",
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