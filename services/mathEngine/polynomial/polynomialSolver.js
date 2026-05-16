import nerdamer from "nerdamer";
import "nerdamer/Algebra";

const solvePolynomial = (problem) => {

  try {

    // 🔥 normalize
    const clean = problem
      .replace(/\s+/g, "")
      .replace(/\)\(/g, ")*(");

    // 🔥 expand
    const expanded = nerdamer.expand(clean).toString();

    return {
      success: true,
      topic: "Polynomial Expansion",
      formula: "Bracket Expansion",
      steps: [
        `Original expression: ${problem}`,
        `Apply distributive law`,
        `Expand all brackets`,
      ],
      answer: expanded,
      relatedTopics: [
        "Algebra",
        "Factorization",
        "Quadratic Expressions",
      ],
    };

  } catch (err) {

    return {
      success: false,
      message: "Invalid polynomial expression",
    };
  }
};

export default solvePolynomial;