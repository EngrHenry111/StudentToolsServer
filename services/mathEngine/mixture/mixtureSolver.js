import { formatResponse } from "../../formatter.js";

const solveMixture = (problem) => {
  const text = problem.toLowerCase();

  const match = text.match(/(\d+)%.*?(\d+).*?(\d+)%.*?(\d+)/);

  if (match) {
    const c1 = Number(match[1]);
    const v1 = Number(match[2]);
    const c2 = Number(match[3]);
    const v2 = Number(match[4]);

    const result = (c1 * v1 + c2 * v2) / (v1 + v2);

    return formatResponse({
      topic: "Mixture",
      formula: "Final = (c1v1 + c2v2)/(v1+v2)",
      steps: [
        `(${c1}×${v1} + ${c2}×${v2}) / (${v1}+${v2})`,
        `= ${result}%`,
      ],
      answer: `${result}%`,
    });
  }

  return { error: "Unsupported mixture problem" };
};

export default solveMixture;