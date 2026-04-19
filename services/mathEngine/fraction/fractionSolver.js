import { parseFraction } from "./fractionParser.js";
import { formatResponse } from "../../formatter.js";


// 🔥 Helper: GCD (for simplification)
const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

// 🔥 Simplify fraction
const simplify = (num, den) => {
  const divisor = gcd(num, den);
  return {
    num: num / divisor,
    den: den / divisor,
  };
};

const solveFraction = (problem) => {
  try {
    const parsed = parseFraction(problem);

    if (!parsed) {
      return { error: "Unsupported fraction format" };
    }

    const { a, b, c, d, operator } = parsed;

    let steps = [];
    let numerator, denominator;

    switch (operator) {

      // ➕ ADDITION
      case "+": {
        const commonDen = b * d;

        const num1 = a * d;
        const num2 = c * b;

        numerator = num1 + num2;
        denominator = commonDen;

        steps = [
          `Find common denominator: ${b} × ${d} = ${commonDen}`,
          `Convert fractions: ${a}/${b} = ${num1}/${commonDen}`,
          `Convert fractions: ${c}/${d} = ${num2}/${commonDen}`,
          `Add numerators: ${num1} + ${num2} = ${numerator}`,
          `Result: ${numerator}/${denominator}`,
        ];

        break;
      }

      // ➖ SUBTRACTION
      case "-": {
        const commonDen = b * d;

        const num1 = a * d;
        const num2 = c * b;

        numerator = num1 - num2;
        denominator = commonDen;

        steps = [
          `Find common denominator: ${b} × ${d} = ${commonDen}`,
          `Convert fractions: ${a}/${b} = ${num1}/${commonDen}`,
          `Convert fractions: ${c}/${d} = ${num2}/${commonDen}`,
          `Subtract numerators: ${num1} - ${num2} = ${numerator}`,
          `Result: ${numerator}/${denominator}`,
        ];

        break;
      }

      // ✖️ MULTIPLICATION
      case "*": {
        numerator = a * c;
        denominator = b * d;

        steps = [
          `Multiply numerators: ${a} × ${c} = ${numerator}`,
          `Multiply denominators: ${b} × ${d} = ${denominator}`,
          `Result: ${numerator}/${denominator}`,
        ];

        break;
      }

      // ➗ DIVISION
      case "/": {
        numerator = a * d;
        denominator = b * c;

        steps = [
          `Invert second fraction: ${c}/${d} → ${d}/${c}`,
          `Multiply: (${a} × ${d}) / (${b} × ${c})`,
          `${a} × ${d} = ${numerator}`,
          `${b} × ${c} = ${denominator}`,
          `Result: ${numerator}/${denominator}`,
        ];

        break;
      }

      default:
        return { error: "Unsupported operation" };
    }

    // 🔥 SIMPLIFY RESULT
    const simplified = simplify(numerator, denominator);

    steps.push(
      `Simplify: ${numerator}/${denominator} → ${simplified.num}/${simplified.den}`
    );

    return formatResponse({
      topic: "Fractions",
      formula: "a/b ± c/d, a/b × c/d, a/b ÷ c/d",
      steps,
      answer: `${simplified.num}/${simplified.den}`,
      relatedTopics: ["Ratio", "Percentage", "Algebra"],
    });

  } catch (error) {
    console.error("Fraction Solver Error:", error);
    return { error: "Solver failed" };
  }
};

export default solveFraction;