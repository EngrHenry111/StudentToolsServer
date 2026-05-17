const parsePolynomial = (problem) => {

  const clean = problem
    .replace(/\s+/g, "")
    .replace(/\)\(/g, ")*(");

  return {
    expression: clean,
  };
};

export default parsePolynomial;