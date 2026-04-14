import { parsePercentage } from "./percentageParser.js";
import { formatResponse } from "../../formatter.js"; // ✅ FIX PATH ALSO

const solvePercentage = (problem) => {
  try {
    const parsed = parsePercentage(problem);

    if (!parsed) {
      return { error: "Unsupported percentage format" };
    }

    let steps = [];
    let answer;

    switch (parsed.type) {

      case "basic": {
        const { percent, total } = parsed;
        const result = (percent / 100) * total;

        steps = [
          `Convert ${percent}% to ${percent}/100`,
          `Multiply by ${total}`,
          `${percent}/100 × ${total} = ${result}`,
        ];

        answer = result;
        break;
      }

      case "increase": {
        const { value, percent } = parsed;
        const increase = (percent / 100) * value;
        const result = value + increase;

        steps = [
          `Find ${percent}% of ${value}`,
          `${percent}/100 × ${value} = ${increase}`,
          `${value} + ${increase} = ${result}`,
        ];

        answer = result;
        break;
      }

      case "decrease": {
        const { value, percent } = parsed;
        const decrease = (percent / 100) * value;
        const result = value - decrease;

        steps = [
          `${percent}/100 × ${value} = ${decrease}`,
          `${value} - ${decrease} = ${result}`,
        ];

        answer = result;
        break;
      }

      case "reverse": {
        const { percent, result } = parsed;
        const original = (result * 100) / percent;

        steps = [
          `${percent}/100 × x = ${result}`,
          `x = (${result} × 100) / ${percent}`,
          `x = ${original}`,
        ];

        answer = original;
        break;
      }

      case "profit": {
        const { cost, selling } = parsed;
        const profit = selling - cost;
        const percent = (profit / cost) * 100;

        steps = [
          `${selling} - ${cost} = ${profit}`,
          `(${profit} / ${cost}) × 100 = ${percent}%`,
        ];

        answer = `${percent}% profit`;
        break;
      }

      case "discount": {
        const { percent, price } = parsed;
        const discount = (percent / 100) * price;
        const finalPrice = price - discount;

        steps = [
          `${percent}/100 × ${price} = ${discount}`,
          `${price} - ${discount} = ${finalPrice}`,
        ];

        answer = finalPrice;
        break;
      }

      default:
        return { error: "Unsupported percentage type" };
    }

    return formatResponse({
      topic: "Percentage",
      formula: "Percentage Calculations",
      steps,
      answer,
      relatedTopics: [
        "Profit & Loss",
        "Ratio",
        "Simple Interest",
      ],
    });

  } catch (error) {
    console.error("Percentage solver error:", error);
    return { error: "Solver failed" };
  }
};

export default solvePercentage;