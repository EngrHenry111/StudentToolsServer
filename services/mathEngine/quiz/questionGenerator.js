export const generatePercentageQuestion = () => {
  const percent = Math.floor(Math.random() * 50) + 10;
  const total = Math.floor(Math.random() * 500) + 50;

  const answer = (percent / 100) * total;

  return {
    question: `${percent}% of ${total}`,
    answer,
    topic: "Percentage",
  };
};