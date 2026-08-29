// Previously this fed the ENTIRE raw sentence — including instruction
// words like "Expand" — directly into the multiplication-insertion
// rules below, so "Expand (x+2)(x+3)" became "Expand*(x+2)*(x+3)" and
// the literal word "Expand" then got treated as an algebraic symbol by
// the expansion engine, producing garbage like "Expandx^25Expandx+6Expand".
// Fix: strip common instruction/question words first, so only the
// actual mathematical expression reaches the transforms below.
const INSTRUCTION_WORDS = [
  "expand", "simplify", "solve", "evaluate", "find", "calculate",
  "determine", "factorize", "factorise", "the", "expression",
  "polynomial", "value", "of", "for", "please", "what", "is"
];

const stripInstructionWords = (text) => {
  let cleaned = text;
  for (const word of INSTRUCTION_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
  }
  return cleaned;
};

const parsePolynomial = (problem) => {

  let clean = stripInstructionWords(problem);

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
