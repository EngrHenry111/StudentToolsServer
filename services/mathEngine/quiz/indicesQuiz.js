const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateIndicesQuestion = () => {
  const base = rand(2, 5);
  const power = rand(2, 4);

  const result = base ** power;

  return {
    question: `Evaluate ${base}^${power}`,
    answer: result,
    topic: "indices",
    difficulty: "easy",
    solution: {
      formula: "a^n = repeated multiplication",
      steps: [
        `${base}^${power} = ${base} × ${base} ...`,
        `= ${result}`,
      ],
      answer: result,
    },
  };
};

export default generateIndicesQuestion;