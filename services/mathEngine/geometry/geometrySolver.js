import { formatResponse } from "../../formatter.js";

const solveGeometry = (problem) => {
  const text = problem.toLowerCase();

  // Rectangle area
  const rect = text.match(/length (\d+).*width (\d+)/);

  if (rect && text.includes("area")) {
    const l = Number(rect[1]);
    const w = Number(rect[2]);
    const area = l * w;

    return formatResponse({
      topic: "Geometry",
      formula: "Area = Length × Width",
      steps: [
        `Length = ${l}, Width = ${w}`,
        `Area = ${l} × ${w}`,
        `= ${area}`,
      ],
      answer: area,
    });
  }

  return { error: "Unsupported geometry problem" };
};

export default solveGeometry;