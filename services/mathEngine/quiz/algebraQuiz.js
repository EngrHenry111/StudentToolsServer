 const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateAlgebraQuestion = () => {
  const x = random(1, 10);
  const a = random(1, 5);
  const b = random(1, 10);

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
    type: "number",

    solution: {
      formula: "ax + b = c",
      steps,
      answer: x,
    },
  };
};

export default generateAlgebraQuestion;