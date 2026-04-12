import { parsePercentage } from "./percentageParser.js";
import { formatResponse } from "../../formatter.js";


const solvePercentage = (problem) => {
  const parsed = parsePercentage(problem);

  if (!parsed) {
    return { error: "Unsupported percentage format" };
  }

  let steps = [];
  let answer;

  switch (parsed.type) {

    // 🔹 BASIC
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

    // 🔹 INCREASE
    case "increase": {
      const { value, percent } = parsed;
      const increase = (percent / 100) * value;
      const result = value + increase;

      steps = [
        `Find ${percent}% of ${value}`,
        `${percent}/100 × ${value} = ${increase}`,
        `Add to original value`,
        `${value} + ${increase} = ${result}`,
      ];

      answer = result;
      break;
    }

    // 🔹 DECREASE
    case "decrease": {
      const { value, percent } = parsed;
      const decrease = (percent / 100) * value;
      const result = value - decrease;

      steps = [
        `Find ${percent}% of ${value}`,
        `${percent}/100 × ${value} = ${decrease}`,
        `Subtract from original value`,
        `${value} - ${decrease} = ${result}`,
      ];

      answer = result;
      break;
    }

    // 🔹 REVERSE
    case "reverse": {
      const { percent, result } = parsed;
      const original = (result * 100) / percent;

      steps = [
        `Let the number be x`,
        `${percent}/100 × x = ${result}`,
        `x = (${result} × 100) / ${percent}`,
        `x = ${original}`,
      ];

      answer = original;
      break;
    }

    // 🔹 PROFIT
    case "profit": {
      const { cost, selling } = parsed;
      const profit = selling - cost;
      const percent = (profit / cost) * 100;

      steps = [
        `Profit = Selling Price - Cost Price`,
        `${selling} - ${cost} = ${profit}`,
        `Profit% = (Profit / Cost) × 100`,
        `(${profit} / ${cost}) × 100 = ${percent}%`,
      ];

      answer = `${percent}% profit`;
      break;
    }

    // 🔹 DISCOUNT
    case "discount": {
      const { percent, price } = parsed;
      const discount = (percent / 100) * price;
      const finalPrice = price - discount;

      steps = [
        `Find ${percent}% of ${price}`,
        `${percent}/100 × ${price} = ${discount}`,
        `Subtract discount from price`,
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
};

export default solvePercentage;