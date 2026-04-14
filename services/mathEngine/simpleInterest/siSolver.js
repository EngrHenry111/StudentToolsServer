import { parseSI } from "./siParser..js";
import { formatResponse } from "../../formatter.js";

const solveSI = (problem) => {
  const parsed = parseSI(problem);

  if (!parsed) return { error: "Unsupported SI format" };

  const { P, R, T } = parsed;

  const SI = (P * R * T) / 100;

  return formatResponse({
    topic: "Simple Interest",
    formula: "SI = (P × R × T) / 100",
    steps: [
      `SI = (${P} × ${R} × ${T}) / 100`,
      `SI = ${SI}`,
    ],
    answer: SI,
    relatedTopics: ["Compound Interest"],
  });
};


try {
  // logic
} catch (error) {
  console.error("Solver error:", error);
  return { error: "Solver failed" };
}
export default solveSI;