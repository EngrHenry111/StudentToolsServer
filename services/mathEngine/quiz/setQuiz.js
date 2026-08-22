const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateSetTheoryQuestion = (difficulty = "medium") => {
  const range = difficulty === "hard" ? [30, 100] : difficulty === "easy" ? [10, 40] : [10, 60];

  const A = rand(range[0], range[1]);
  const B = rand(range[0], range[1]);
  // Intersection can never exceed the smaller of the two sets.
  const intersect = rand(0, Math.min(A, B, 15));

  const union = A + B - intersect;

  return {
    question: `If n(A)=${A}, n(B)=${B}, n(A∩B)=${intersect}, find n(A∪B)`,
    answer: union,
    topic: "Set Theory",
    difficulty,
    type: "number",
    solution: {
      formula: "n(A∪B) = n(A) + n(B) - n(A∩B)",
      steps: [
        `n(A∪B) = ${A} + ${B} - ${intersect}`,
        `= ${union}`
      ],
      answer: union
    }
  };
};
