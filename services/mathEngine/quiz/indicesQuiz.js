const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateIndicesQuestion = (difficulty = "easy") => {
  const base = difficulty === "hard" ? rand(2, 8) : difficulty === "medium" ? rand(2, 6) : rand(2, 5);
  const power = difficulty === "hard" ? rand(2, 5) : rand(2, 4);

  const result = base ** power;

  return {
    question: `Evaluate ${base}^${power}`,
    answer: result,
    topic: "indices",
    difficulty,
    type: "number",
    solution: {
      formula: "a^n = a × a × ... (n times)",
      steps: [
        `${base}^${power} = ${Array(power).fill(base).join(" × ")}`,
        `= ${result}`
      ],
      answer: result
    }
  };
};

export default generateIndicesQuestion;
