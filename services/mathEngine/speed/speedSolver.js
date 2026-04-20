import { formatResponse } from "../../formatter.js";

const solveSpeed = (problem) => {
  const nums = problem.match(/\d+/g)?.map(Number);

  if (!nums || nums.length < 2) {
    return { error: "Invalid speed input" };
  }

  const [speed, time] = nums;
  const distance = speed * time;

  return formatResponse({
    topic: "Speed Distance",
    formula: "Distance = Speed × Time",
    steps: [
      `Speed = ${speed}`,
      `Time = ${time}`,
      `Distance = ${speed} × ${time}`,
      `= ${distance}`,
    ],
    answer: distance,
    relatedTopics: ["Ratio"],
  });
};

export default solveSpeed;