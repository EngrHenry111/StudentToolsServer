export const parseLinearEquation = (problem) => {
  const cleaned = problem.replace(/\s+/g, "");

  // Pattern 1: ax + b = c OR ax - b = c
  let match = cleaned.match(/^(\d*)x([+-]\d+)=(-?\d+)$/);
  if (match) {
    return {
      type: "ax_plus_b",
      a: parseFloat(match[1] || 1),
      b: parseFloat(match[2]),
      c: parseFloat(match[3]),
    };
  }

  // Pattern 2: ax = c
  match = cleaned.match(/^(\d*)x=(-?\d+)$/);
  if (match) {
    return {
      type: "ax",
      a: parseFloat(match[1] || 1),
      c: parseFloat(match[2]),
    };
  }

  // Pattern 3: x/n + b = c
  match = cleaned.match(/^x\/(\d+)([+-]\d+)=(-?\d+)$/);
  if (match) {
    return {
      type: "x_div_n_plus_b",
      n: parseFloat(match[1]),
      b: parseFloat(match[2]),
      c: parseFloat(match[3]),
    };
  }

  // Pattern 4: x/n = c
  match = cleaned.match(/^x\/(\d+)=(-?\d+)$/);
  if (match) {
    return {
      type: "x_div_n",
      n: parseFloat(match[1]),
      c: parseFloat(match[2]),
    };
  }

  return null;
};