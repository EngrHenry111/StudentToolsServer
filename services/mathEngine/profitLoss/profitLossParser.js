export const parseProfitLoss = (problem) => {
  const text = problem.toLowerCase();

  let match = text.match(/cost.*?(\d+).*?selling.*?(\d+)/);
  if (match) {
    return {
      type: "profit",
      cost: parseFloat(match[1]),
      selling: parseFloat(match[2]),
    };
  }

  return null;
};