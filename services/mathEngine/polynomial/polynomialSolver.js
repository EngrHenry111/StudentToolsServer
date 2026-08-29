import nerdamer from "nerdamer";
import "nerdamer/Algebra.js";

import parsePolynomial from "./polynomialParser.js";

// 🔥 FORMAT RESULT
const formatPolynomial = (expression) => {

  let exp = expression
    .replace(/\+\-/g, "-")
    .replace(/\*/g, "")
    .replace(/\s+/g, "");

  const rawTerms = exp.match(/[+\-]?[^+\-]+/g) || [];

  // Bug fix: nerdamer's raw output can put terms in any order (e.g.
  // "5*x+x^2+6" — linear term FIRST, so it never has a leading "+").
  // When terms below get reordered into square→linear→constant, a term
  // that started as "first" (no sign) ends up stuck in the MIDDLE with
  // no separator, producing garbage like "x^25x+6" instead of
  // "x^2+5x+6". Fix: every term gets an explicit sign BEFORE reordering.
  const terms = rawTerms.map((t) =>
    t.startsWith("+") || t.startsWith("-") ? t : `+${t}`
  );

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
    .join("")
    .replace(/\+\-/g, "-")
    .replace(/\-\+/g, "-")
    .replace(/\+\+/g, "+")
    .replace(/^\+/, "");
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