export const parseSimultaneous = (problem) => {
  const text = problem.toLowerCase();

  // Example: 2x + y = 5, x - y = 1
  let match = text.match(/(.+)=\s*(\d+).+(.+)=\s*(\d+)/);

  if (match) {
    return {
      type: "system",
      eq1: match[1],
      val1: parseFloat(match[2]),
      eq2: match[3],
      val2: parseFloat(match[4]),
    };
  }

  return null;
};