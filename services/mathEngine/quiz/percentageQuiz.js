  const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePercentageQuestion = (difficulty) => {
  let base, percent;

  if (difficulty === "easy") {
    base = random(50, 200);
    percent = random(5, 30);
  } else if (difficulty === "medium") {
    base = random(100, 500);
    percent = random(10, 60);
  } else {
    base = random(200, 1000);
    percent = random(20, 90);
  }

  const answer = (percent / 100) * base;

  const steps = [
    `Convert ${percent}% to ${percent}/100`,
    `Multiply by ${base}`,
    `${percent}/100 × ${base} = ${answer}`,
  ];

  return {
    question: `${percent}% of ${base}`,
    answer,
    topic: "percentage",
    difficulty,
    type: "number",

    // 🔥 PRECOMPUTED SOLUTION
    solution: {
      formula: "Percentage = (part / 100) × total",
      steps,
      answer,
    },
  };
};

export default generatePercentageQuestion;