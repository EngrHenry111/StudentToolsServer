import { formatResponse } from "../../formatter.js";

// Same class of bug as the polynomial parser: instruction words in the
// sentence can themselves contain "x" or "y" and get misread as
// coefficients — e.g. "simultaneously" ends in "y", so without stripping
// it first, that trailing "y" was silently counted as a real +1
// coefficient, corrupting the whole equation.
const INSTRUCTION_WORDS = [
  "solve", "simultaneously", "the", "system", "equations", "equation",
  "find", "please", "value", "of", "for", "what", "is"
];

const stripInstructionWords = (text) => {
  let cleaned = text;
  for (const word of INSTRUCTION_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
  }
  return cleaned;
};

// Parses one side of one linear equation like "2x+3y", "x-y", "-x+2y"
// into {x: coeff, y: coeff} — handling implicit coefficients (a bare "x"
// or "y" means coefficient 1, not NaN, which was the original bug here:
// the old regex captured just the sign character ("+") with no digit
// and did Number("+") = NaN whenever a coefficient was left implicit.
const parseLinearSide = (side) => {
  const termPattern = /([+-]?\d*)(x|y)/g;
  let match;
  const coeffs = { x: 0, y: 0 };

  while ((match = termPattern.exec(side)) !== null) {
    const [, rawCoeff, variable] = match;
    let coeff;
    if (rawCoeff === "" || rawCoeff === "+") coeff = 1;
    else if (rawCoeff === "-") coeff = -1;
    else coeff = Number(rawCoeff);
    coeffs[variable] += coeff;
  }

  return coeffs;
};

const parseEquation = (eq) => {
  const [left, right] = eq.split("=");
  const coeffs = parseLinearSide(left.trim());
  return { a: coeffs.x, b: coeffs.y, c: Number(right.trim()) };
};

const solveSimultaneous = (problem) => {
  // Strip instruction words BEFORE removing whitespace/splitting, so
  // "and" (the equation separator) and "x"/"y" (the real variables)
  // survive, but label words like "simultaneously" don't pollute the
  // coefficient parsing.
  const cleanedProblem = stripInstructionWords(problem);
  const text = cleanedProblem.replace(/\s+/g, "").toLowerCase();

  // Directly extract complete "terms=number" equation chunks with a
  // pattern match, rather than splitting the text on "and"/","/";" —
  // splitting broke whenever the sentence had a SECOND "and" somewhere
  // else (e.g. "...and x-y=2. Find x and y" has two "and"s: one is the
  // real equation separator, the other is just part of "find x and y",
  // and a blind split produced a mangled second equation like
  // "x-y=2.x" with a stray trailing letter where a number should be).
  // This pattern only matches genuine "<x/y terms>=<number>" chunks, so
  // stray surrounding words are naturally skipped rather than merged in.
  const equationPattern = /[a-z0-9+\-]*[xy][a-z0-9+\-]*=-?\d+(?:\.\d+)?/g;
  const parts = text.match(equationPattern) || [];

  if (parts.length < 2) {
    return { error: "Could not find two equations to solve" };
  }

  let eq1, eq2;
  try {
    eq1 = parseEquation(parts[0]);
    eq2 = parseEquation(parts[1]);
  } catch {
    return { error: "Invalid simultaneous equation format" };
  }

  const { a: a1, b: b1, c: c1 } = eq1;
  const { a: a2, b: b2, c: c2 } = eq2;

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return { error: "No unique solution — these equations are parallel or identical" };
  }

  const x = (c1 * b2 - c2 * b1) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  // Round to avoid ugly floating-point tails like 2.9999999999998
  const roundedX = Math.round(x * 1000) / 1000;
  const roundedY = Math.round(y * 1000) / 1000;

  return formatResponse({
    topic: "Simultaneous Equations",
    formula: "Elimination Method",
    steps: [
      `Equation 1: ${a1}x + ${b1}y = ${c1}`,
      `Equation 2: ${a2}x + ${b2}y = ${c2}`,
      `Determinant = (${a1}×${b2}) - (${a2}×${b1}) = ${determinant}`,
      `x = ((${c1}×${b2}) - (${c2}×${b1})) / ${determinant} = ${roundedX}`,
      `y = ((${a1}×${c2}) - (${a2}×${c1})) / ${determinant} = ${roundedY}`,
    ],
    answer: `x = ${roundedX}, y = ${roundedY}`,
  });
};

export default solveSimultaneous;
