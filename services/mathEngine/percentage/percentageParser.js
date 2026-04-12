export const parsePercentage = (problem) => {
  const text = problem.toLowerCase().replace(/\s+/g, " ");

  // 🔹 1. Basic: 20% of 150
  let match = text.match(/(\d+)%\s*of\s*(\d+)/);
  if (match) {
    return {
      type: "basic",
      percent: parseFloat(match[1]),
      total: parseFloat(match[2]),
    };
  }

  // 🔹 2. Increase: Increase 200 by 10%
  match = text.match(/increase\s*(\d+)\s*by\s*(\d+)%/);
  if (match) {
    return {
      type: "increase",
      value: parseFloat(match[1]),
      percent: parseFloat(match[2]),
    };
  }

  // 🔹 3. Decrease: Decrease 500 by 5%
  match = text.match(/decrease\s*(\d+)\s*by\s*(\d+)%/);
  if (match) {
    return {
      type: "decrease",
      value: parseFloat(match[1]),
      percent: parseFloat(match[2]),
    };
  }

  // 🔹 4. Reverse: 20% of what is 40
  match = text.match(/(\d+)%\s*of\s*what\s*(is)?\s*(\d+)/);
  if (match) {
    return {
      type: "reverse",
      percent: parseFloat(match[1]),
      result: parseFloat(match[3]),
    };
  }

  // 🔹 5. Profit: Profit of 500 and 650
  match = text.match(/profit\s*(of)?\s*(\d+)\s*(and)?\s*(\d+)/);
  if (match) {
    return {
      type: "profit",
      cost: parseFloat(match[2]),
      selling: parseFloat(match[4]),
    };
  }

  // 🔹 6. Discount: Discount of 20% on 1000
  match = text.match(/discount\s*(of)?\s*(\d+)%\s*(on)?\s*(\d+)/);
  if (match) {
    return {
      type: "discount",
      percent: parseFloat(match[2]),
      price: parseFloat(match[4]),
    };
  }

  return null;
};