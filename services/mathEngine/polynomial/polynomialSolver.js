import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

// 🔥 FORMAT RESULT
const formatPolynomial = (expression) => {

  let exp = expression
    .replace(/\+\-/g, "-")
    .replace(/\s+/g, "");

  // 🔥 Convert weird orderings manually
  // Example: -6-a+a^2 -> a^2-a-6

  const terms = exp.match(/[+\-]?[^+\-]+/g) || [];

  const grouped = {
    square: [],
    linear: [],
    constant: [],
  };

  terms.forEach((term) => {

    if (term.includes("^2")) {
      grouped.square.push(term);

    } else if (/[a-z]/i.test(term)) {
      grouped.linear.push(term);

    } else {
      grouped.constant.push(term);
    }
  });

  return [
    ...grouped.square,
    ...grouped.linear,
    ...grouped.constant,
  ]
    .join("+")
    .replace(/\+\-/g, "-");
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