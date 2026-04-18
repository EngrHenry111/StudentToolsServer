export const generatePercentageQuestion = (difficulty = "easy") => {
  let percent, total;

  if (difficulty === "easy") {
    percent = Math.floor(Math.random() * 20) + 5;
    total = Math.floor(Math.random() * 100) + 50;
  }

  if (difficulty === "medium") {
    percent = Math.floor(Math.random() * 50) + 10;
    total = Math.floor(Math.random() * 500) + 100;
  }

  if (difficulty === "hard") {
    percent = Math.floor(Math.random() * 80) + 10;
    total = Math.floor(Math.random() * 1000) + 200;
  }

  const answer = Number(((percent / 100) * total).toFixed(2));

  return {
    question: `${percent}% of ${total}`,
    answer,
    topic: "Percentage",
    difficulty,
  };
};