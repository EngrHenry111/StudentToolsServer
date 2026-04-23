export const parseIndices = (problem) => {
  const text = problem.toLowerCase();

  let match = text.match(/(\d+)\^(\d+)/);

  if (match) {
    return {
      type: "power",
      base: parseFloat(match[1]),
      exponent: parseFloat(match[2]),
    };
  }

  return null;
};