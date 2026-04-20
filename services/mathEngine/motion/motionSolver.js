import { formatResponse } from "../../formatter.js";

const solveMotion = (problem) => {
  const text = problem.toLowerCase();

  try {
    // Extract numbers
    const speedMatch = text.match(/(\d+)\s*km\/h/);
    const timeMatch = text.match(/(\d+)\s*hours?/);

    if (speedMatch && timeMatch) {
      const speed = Number(speedMatch[1]);
      const time = Number(timeMatch[1]);

      const distance = speed * time;

      return formatResponse({
        topic: "Speed Distance Time",
        formula: "Distance = Speed × Time",
        steps: [
          `Speed = ${speed} km/h`,
          `Time = ${time} hours`,
          `Distance = Speed × Time`,
          `${speed} × ${time} = ${distance} km`,
        ],
        answer: `${distance} km`,
        relatedTopics: ["Physics", "Algebra"],
      });
    }

    return { error: "Unsupported motion problem format" };

  } catch (err) {
    return { error: "Motion solver failed" };
  }
};

export default solveMotion;