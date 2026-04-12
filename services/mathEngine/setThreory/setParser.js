export const parseSetProblem = (problem) => {
  const text = problem.replace(/\s+/g, "");

  // 🔹 2-set problem
  let match = text.match(
    /n\(A\)=(\d+),?n\(B\)=(\d+),?n\(A∩B\)=(\d+)/
  );

  if (match) {
    return {
      type: "two_sets",
      A: parseFloat(match[1]),
      B: parseFloat(match[2]),
      intersection: parseFloat(match[3]),
    };
  }

  // 🔹 3-set problem
  match = text.match(
    /n\(A\)=(\d+),?n\(B\)=(\d+),?n\(C\)=(\d+),?n\(A∩B\)=(\d+),?n\(A∩C\)=(\d+),?n\(B∩C\)=(\d+),?n\(A∩B∩C\)=(\d+)/
  );

  if (match) {
    return {
      type: "three_sets",
      A: parseFloat(match[1]),
      B: parseFloat(match[2]),
      C: parseFloat(match[3]),
      AB: parseFloat(match[4]),
      AC: parseFloat(match[5]),
      BC: parseFloat(match[6]),
      ABC: parseFloat(match[7]),
    };
  }

  // 🔹 Complement: n(U)=100, n(A)=40
  match = text.match(/n\(U\)=(\d+),?n\(A\)=(\d+)/);
  if (match) {
    return {
      type: "complement",
      U: parseFloat(match[1]),
      A: parseFloat(match[2]),
    };
  }

  return null;
};