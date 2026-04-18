export const generateSimpleInterestQuestion = () => {
  const p = Math.floor(Math.random() * 5000) + 1000;
  const r = Math.floor(Math.random() * 10) + 1;
  const t = Math.floor(Math.random() * 5) + 1;

  const si = (p * r * t) / 100;

  return {
    question: `Find SI when P=${p}, R=${r}%, T=${t}`,
    answer: si,
    topic: "Simple Interest",
    difficulty: "medium",
    type: "interest",
  };
};