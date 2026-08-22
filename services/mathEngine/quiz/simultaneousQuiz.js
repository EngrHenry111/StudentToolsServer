const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateSimultaneousQuestion = (difficulty = "easy") => {
  const range = difficulty === "hard" ? 15 : difficulty === "medium" ? 10 : 6;

  // Pick the real answer FIRST, then build two independent equations
  // around it — the previous version literally stated "x = 5" directly
  // in the question text, so there was nothing left to actually solve.
  // Classic elimination pair: x + y = S, x - y = D.
  const x = rand(1, range);
  const y = rand(1, range);

  const sum = x + y;
  const diff = x - y;

  return {
    question: `Solve: x + y = ${sum} and x - y = ${diff >= 0 ? diff : `(${diff})`}. Find x and y (answer as "x, y")`,
    answer: `${x}, ${y}`,
    topic: "simultaneous",
    difficulty,
    type: "simultaneous",
    solution: {
      formula: "Add the equations to eliminate y, then substitute back",
      steps: [
        `x + y = ${sum}`,
        `x - y = ${diff}`,
        `Add both equations: 2x = ${sum + diff}, so x = ${x}`,
        `Substitute into x + y = ${sum}: y = ${y}`
      ],
      answer: `${x}, ${y}`
    }
  };
};

export default generateSimultaneousQuestion;
