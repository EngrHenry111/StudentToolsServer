const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const generateFractionQuestion = (difficulty = "easy") => {
  const range = difficulty === "hard" ? 9 : difficulty === "medium" ? 7 : 5;

  const a = Math.floor(Math.random() * range) + 1;
  const b = Math.floor(Math.random() * range) + 1;
  const c = Math.floor(Math.random() * range) + 1;
  const d = Math.floor(Math.random() * range) + 1;

  const rawNumerator = a * d + b * c;
  const rawDenominator = b * d;

  // Always reduce to lowest terms — previously this returned things like
  // "8/8" instead of "1", so a student who correctly simplified their
  // answer (as they're taught to) was marked wrong for being "too right".
  const divisor = gcd(rawNumerator, rawDenominator);
  const numerator = rawNumerator / divisor;
  const denominator = rawDenominator / divisor;

  const answer = denominator === 1 ? `${numerator}` : `${numerator}/${denominator}`;

  return {
    question: `${a}/${b} + ${c}/${d} (give your answer in lowest terms)`,
    answer,
    topic: "Fractions",
    difficulty,
    type: "fraction",
    solution: {
      formula: "a/b + c/d = (ad + bc) / bd",
      steps: [
        `${a}/${b} + ${c}/${d} = (${a}×${d} + ${b}×${c}) / (${b}×${d})`,
        `= ${rawNumerator}/${rawDenominator}`,
        divisor > 1
          ? `Simplify by dividing both by ${divisor} = ${answer}`
          : `Already in lowest terms = ${answer}`
      ],
      answer
    }
  };
};
