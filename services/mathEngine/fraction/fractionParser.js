export const parseFraction = (problem) => {
  const text = problem.replace(/\s+/g, "");

  // Example: 1/2 + 3/4
  let match = text.match(/(\d+)\/(\d+)([+\-*/])(\d+)\/(\d+)/);

  if (match) {
    return {
      type: "operation",
      n1: +match[1],
      d1: +match[2],
      op: match[3],
      n2: +match[4],
      d2: +match[5],
    };
  }

  return null;
};