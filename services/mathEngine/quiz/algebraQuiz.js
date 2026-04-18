export const generateAlgebraQuestion = () => {
  const x = Math.floor(Math.random() * 10) + 1;
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 10);

  const result = a * x + b;

  return {
    question: `${a}x + ${b} = ${result}`,
    answer: x,
    topic: "Algebra",
    difficulty: "easy",
  };
};