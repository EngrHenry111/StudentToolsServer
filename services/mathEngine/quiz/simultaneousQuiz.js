const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateSimultaneousQuestion = () => {
  const x = rand(1, 10);
  const y = rand(1, 10);

  return {
    question: `Solve: x + y = ${x + y}, x = ${x}`,
    answer: `${x}, ${y}`,
    topic: "simultaneous",
    difficulty: "easy",
    solution: {
      formula: "Substitution",
      steps: [
        `x = ${x}`,
        `Substitute into equation`,
        `y = ${y}`,
      ],
      answer: `${x}, ${y}`,
    },
  };
};

export default generateSimultaneousQuestion;