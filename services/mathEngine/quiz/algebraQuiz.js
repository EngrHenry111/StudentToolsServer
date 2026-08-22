const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateAlgebraQuestion = (difficulty = "easy") => {
  // Previously this ignored the difficulty argument entirely — every
  // question used the same ranges no matter what was selected, and the
  // returned object never included a "difficulty" field at all, so the
  // UI's difficulty tag showed blank for every algebra question.
  const xRange = difficulty === "hard" ? 20 : difficulty === "medium" ? 12 : 10;
  const aRange = difficulty === "hard" ? 9 : difficulty === "medium" ? 6 : 5;
  const bRange = difficulty === "hard" ? 20 : difficulty === "medium" ? 12 : 10;

  const x = random(1, xRange);
  const a = random(1, aRange);
  const b = random(1, bRange);

  const result = a * x + b;

  const steps = [
    `Given: ${a}x + ${b} = ${result}`,
    `Subtract ${b}: ${a}x = ${result - b}`,
    `Divide by ${a}: x = ${(result - b) / a}`,
  ];

  return {
    question: `${a}x + ${b} = ${result}`,
    answer: x,
    topic: "algebra",
    difficulty,
    type: "number",

    solution: {
      formula: "ax + b = c",
      steps,
      answer: x,
    },
  };
};

export default generateAlgebraQuestion;
