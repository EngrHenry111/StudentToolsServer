const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateSimpleInterestQuestion = (difficulty = "medium") => {
  const pRange = difficulty === "hard" ? [5000, 20000] : difficulty === "easy" ? [500, 2000] : [1000, 6000];
  const rRange = difficulty === "hard" ? 20 : 10;
  const tRange = difficulty === "hard" ? 8 : 5;

  const p = rand(pRange[0], pRange[1]);
  const r = rand(1, rRange);
  const t = rand(1, tRange);

  const si = (p * r * t) / 100;

  return {
    question: `Find the Simple Interest when Principal=${p}, Rate=${r}%, Time=${t} years`,
    answer: si,
    topic: "Simple Interest",
    difficulty,
    type: "number",
    solution: {
      formula: "SI = (P × R × T) / 100",
      steps: [
        `SI = (${p} × ${r} × ${t}) / 100`,
        `= ${si}`
      ],
      answer: si
    }
  };
};
