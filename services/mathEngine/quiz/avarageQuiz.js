const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateAverageQuestion = (difficulty) => {
  const a = rand(10, 50);
  const b = rand(10, 50);
  const c = rand(10, 50);

  const avg = (a + b + c) / 3;

  return {
    question: `Find the average of ${a}, ${b}, and ${c}`,
    answer: avg,
    topic: "average",
    difficulty,
    solution: {
      formula: "Average = (sum) / count",
      steps: [
        `${a} + ${b} + ${c} = ${a + b + c}`,
        `Divide by 3`,
        `Answer = ${avg}`,
      ],
      answer: avg,
    },
  };
};

export default generateAverageQuestion;