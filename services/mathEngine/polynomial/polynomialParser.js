const parsePolynomial = (problem) => {

  let clean = problem;

  // 🔥 remove spaces
  clean = clean.replace(/\s+/g, "");

  // 🔥 (x+2)(x+3) → (x+2)*(x+3)
  clean = clean.replace(/\)\(/g, ")*(");

  // 🔥 x(x+2) → x*(x+2)
  clean = clean.replace(/([a-zA-Z0-9])\(/g, "$1*(");

  // 🔥 (x+2)x → (x+2)*x
  clean = clean.replace(/\)([a-zA-Z0-9])/g, ")*$1");

  // 🔥 2x → 2*x
  clean = clean.replace(/(\d)([a-zA-Z])/g, "$1*$2");

  return {
    expression: clean,
  };
};

export default parsePolynomial;