export const parseSI = (problem) => {
  const text = problem.toLowerCase();

  let match = text.match(/p=(\d+),?\s*r=(\d+),?\s*t=(\d+)/);

  if (match) {
    return {
      type: "si",
      P: +match[1],
      R: +match[2],
      T: +match[3],
    };
  }

  return null;
};