export const parseRatio = (problem) => {
  const text = problem.toLowerCase();

  // Example: divide 100 in ratio 2:3
  let match = text.match(/divide\s*(\d+)\s*in\s*ratio\s*(\d+):(\d+)/);

  if (match) {
    return {
      type: "divide",
      total: +match[1],
      r1: +match[2],
      r2: +match[3],
    };
  }

  return null;
};