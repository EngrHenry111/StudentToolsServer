export const parseMotion = (problem) => {
  const text = problem.toLowerCase();

  let match = text.match(/speed\s*(\d+).*?time\s*(\d+)/);

  if (match) {
    return {
      type: "distance",
      speed: parseFloat(match[1]),
      time: parseFloat(match[2]),
    };
  }

  return null;
};