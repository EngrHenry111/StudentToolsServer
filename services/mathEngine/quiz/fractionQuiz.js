export const generateFractionQuestion = (difficulty = "easy") => {
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 5) + 1;
  const c = Math.floor(Math.random() * 5) + 1;
  const d = Math.floor(Math.random() * 5) + 1;

  const numerator = a * d + b * c;
  const denominator = b * d;

  return {
    question: `${a}/${b} + ${c}/${d}`,
    answer: `${numerator}/${denominator}`,
    topic: "Fractions",
    difficulty,
    type: "fraction",
  };
};