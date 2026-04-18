export const generateRatioQuestion = () => {
  const total = Math.floor(Math.random() * 200) + 50;
  const r1 = Math.floor(Math.random() * 5) + 1;
  const r2 = Math.floor(Math.random() * 5) + 1;

  const sum = r1 + r2;

  const part1 = (r1 / sum) * total;
  const part2 = (r2 / sum) * total;

  return {
    question: `Divide ${total} in ratio ${r1}:${r2}`,
    answer: `${part1}, ${part2}`,
    topic: "Ratio",
    difficulty: "medium",
    type: "ratio",
  };
};