// Previously only recognized the literal phrase pattern "cost...N...
// selling...N" in that exact order — real problems are phrased many
// ways ("bought for 500, sold for 650", "purchased at 500, sells for
// 650"). Fix: recognize a wider vocabulary for each side independently,
// not tied to word order.
const CP_PATTERN = /(?:cost price|cost|bought|buys|purchased|purchase price|cp)\D*?(\d+(?:\.\d+)?)/i;
const SP_PATTERN = /(?:selling price|selling|sold|sells|sale price|sp)\D*?(\d+(?:\.\d+)?)/i;

export const parseProfitLoss = (problem) => {
  const cpMatch = problem.match(CP_PATTERN);
  const spMatch = problem.match(SP_PATTERN);

  if (cpMatch && spMatch) {
    return {
      type: "profit",
      cost: parseFloat(cpMatch[1]),
      selling: parseFloat(spMatch[1]),
    };
  }

  return null;
};
