const parsePolynomial = (problem) => {

  let clean = problem
    .replace(/\s+/g, "");

  // 🔥 Convert adjacent brackets
  clean = clean.replace(/\)\(/g, ")*(");

  // 🔥 Convert x(x+2) → x*(x+2)
  clean = clean.replace(/([a-zA-Z0-9])\(/g, "$1*(");

  // 🔥 Convert )(x → )*(x
  clean = clean.replace(/\)([a-zA-Z])/g, ")*$1");

  return {
    expression: clean,
  };
};

export default parsePolynomial;