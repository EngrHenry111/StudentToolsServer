import { formatResponse } from "../../formatter.js";
import { parseProfitLoss } from "./profitLossParser.js";

const solveProfitLoss = (problem) => {
  const parsed = parseProfitLoss(problem);

  if (!parsed) {
    return { error: "Unsupported profit/loss problem" };
  }

  const { cost, selling } = parsed;
  const diff = selling - cost;
  const isProfit = diff >= 0;
  const percent = cost !== 0 ? Math.abs((diff / cost) * 100) : 0;
  const roundedPercent = Math.round(percent * 100) / 100;

  return formatResponse({
    topic: "Profit & Loss",
    formula: isProfit ? "Profit = SP - CP" : "Loss = CP - SP",
    steps: [
      `CP (Cost Price) = ${cost}, SP (Selling Price) = ${selling}`,
      isProfit
        ? `Profit = ${selling} - ${cost} = ${diff}`
        : `Loss = ${cost} - ${selling} = ${Math.abs(diff)}`,
      `${isProfit ? "Profit" : "Loss"}% = (${Math.abs(diff)}/${cost}) × 100 = ${roundedPercent}%`,
    ],
    answer: `${roundedPercent}% ${isProfit ? "profit" : "loss"}`,
  });
};

export default solveProfitLoss;
