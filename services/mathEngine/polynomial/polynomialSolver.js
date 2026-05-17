import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

// 🔥 FORMAT RESULT
const formatPolynomial = (expression) => {
  return expression
    .replace(/\+\-/g, "-")
    .replace(/^-b\^2\+a\^2$/, "a^2-b^2")
    .replace(/\s+/g, "");
};

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
    let expanded = nerdamer
      .expand(parsed.expression)
      .toString();

    // 🔥 Clean formatting
    expanded = formatPolynomial(expanded);

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