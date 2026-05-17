import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

const solvePolynomial = (problem) => {

  try {

    // 🔥 Parse expression
    const parsed = parsePolynomial(problem);

    console.log("🧠 Parsed Polynomial:", parsed);

    if (!parsed.expression) {
      return {
        success: false,
        message: "Invalid polynomial expression",
      };
    }

    // 🔥 Expand expression
    const expanded = nerdamer
      .expand(parsed.expression)
      .toString();

    return {

      success: true,

      topic: "Polynomial Expansion",

      formula: "Bracket Expansion",

      steps: [
        `Original expression: ${problem}`,
        `Convert implicit multiplication`,
        `Apply distributive law`,
        `Combine like terms`,
      ],

      answer: expanded,

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