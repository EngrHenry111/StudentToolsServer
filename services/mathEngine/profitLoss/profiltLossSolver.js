import { formatResponse } from "../../formatter.js";

const solveProfitLoss = (problem) => {
  const text = problem.toLowerCase();

  const cp = text.match(/cost.*?(\d+)/);
  const sp = text.match(/selling.*?(\d+)/);

  if (cp && sp) {
    const cost = Number(cp[1]);
    const sell = Number(sp[1]);

    const profit = sell - cost;
    const percent = (profit / cost) * 100;

    return formatResponse({
      topic: "Profit & Loss",
      formula: "Profit = SP - CP",
      steps: [
        `SP = ${sell}, CP = ${cost}`,
        `Profit = ${sell} - ${cost} = ${profit}`,
        `Profit% = (${profit}/${cost}) × 100 = ${percent}%`,
      ],
      answer: `${percent}% profit`,
    });
  }

  return { error: "Unsupported profit/loss problem" };
};

export default solveProfitLoss;