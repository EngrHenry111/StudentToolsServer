import { formatResponse } from "../../formatter.js";

const solveAge = (problem) => {
  const text = problem.toLowerCase();

  // Example: "John is 5 years older than Mary, Mary is 10"
  const match = text.match(/(\d+).*older.*(\d+)/);

  if (match) {
    const diff = Number(match[1]);
    const base = Number(match[2]);
    const result = base + diff;

    return formatResponse({
      topic: "Age Problem",
      formula: "Older = Younger + Difference",
      steps: [
        `Difference = ${diff}`,
        `Base age = ${base}`,
        `${base} + ${diff} = ${result}`,
      ],
      answer: result,
    });
  }

  return { error: "Unsupported age problem" };
};

export default solveAge;