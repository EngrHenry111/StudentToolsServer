const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRatioQuestion = (difficulty = "medium") => {
  const unitRange = difficulty === "hard" ? [5, 20] : difficulty === "medium" ? [3, 12] : [2, 8];
  const ratioRange = difficulty === "hard" ? 9 : difficulty === "medium" ? 6 : 4;

  const r1 = rand(1, ratioRange);
  const r2 = rand(1, ratioRange);

  // Pick the "unit" value FIRST and derive total from it, guaranteeing
  // both parts always come out as clean whole numbers — the previous
  // version picked total randomly, so parts were almost always ugly,
  // unpredictable decimals (e.g. "22.714285714285715") that no real
  // student could type back exactly, marking correct answers wrong.
  const unit = rand(unitRange[0], unitRange[1]);
  const total = unit * (r1 + r2);

  const part1 = unit * r1;
  const part2 = unit * r2;

  return {
    question: `Divide ${total} in the ratio ${r1}:${r2}`,
    answer: `${part1}, ${part2}`,
    topic: "Ratio",
    difficulty,
    type: "ratio",
    solution: {
      formula: "part = (ratio share / total ratio) × total",
      steps: [
        `Total ratio parts = ${r1} + ${r2} = ${r1 + r2}`,
        `One part = ${total} ÷ ${r1 + r2} = ${unit}`,
        `First share = ${r1} × ${unit} = ${part1}`,
        `Second share = ${r2} × ${unit} = ${part2}`
      ],
      answer: `${part1}, ${part2}`
    }
  };
};
