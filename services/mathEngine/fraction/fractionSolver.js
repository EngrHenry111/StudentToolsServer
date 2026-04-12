import { parseFraction } from "./fractionParser.js";
import { formatResponse } from "../../formatter.js";

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const simplify = (n, d) => {
  const g = gcd(n, d);
  return [n / g, d / g];
};

const solveFractions = (problem) => {
  const parsed = parseFraction(problem);

  if (!parsed) return { error: "Unsupported fraction format" };

  let { n1, d1, op, n2, d2 } = parsed;

  let numerator, denominator, steps = [];

  if (op === "+") {
    numerator = n1 * d2 + n2 * d1;
    denominator = d1 * d2;

    steps = [
      `Find common denominator: ${d1} × ${d2}`,
      `(${n1}×${d2}) + (${n2}×${d1}) = ${numerator}`,
      `Result = ${numerator}/${denominator}`,
    ];
  }

  if (op === "-") {
    numerator = n1 * d2 - n2 * d1;
    denominator = d1 * d2;

    steps = [
      `Find common denominator`,
      `(${n1}×${d2}) - (${n2}×${d1}) = ${numerator}`,
    ];
  }

  if (op === "*") {
    numerator = n1 * n2;
    denominator = d1 * d2;

    steps = [
      `Multiply numerators and denominators`,
      `${n1}×${n2} / ${d1}×${d2}`,
    ];
  }

  if (op === "/") {
    numerator = n1 * d2;
    denominator = d1 * n2;

    steps = [
      `Invert second fraction and multiply`,
      `${n1}/${d1} × ${d2}/${n2}`,
    ];
  }

  const [sn, sd] = simplify(numerator, denominator);

  return formatResponse({
    topic: "Fractions",
    formula: "Basic Fraction Operations",
    steps: [...steps, `Simplified = ${sn}/${sd}`],
    answer: `${sn}/${sd}`,
    relatedTopics: ["Decimals", "Ratio"],
  });
};

export default solveFractions;