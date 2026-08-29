// Same root bug as the polynomial/simultaneous parsers: the old code
// used ANCHORED regexes (^...$) requiring the ENTIRE cleaned string to
// match the equation pattern exactly. Real input like "Solve for x: 3x
// + 5 = 20" becomes "Solveforx:3x+5=20" after whitespace removal — the
// leading instruction text breaks every anchored match, so this never
// matched a single real-world phrased problem. Fix: strip instruction
// words/punctuation FIRST (while spaces are intact, so word boundaries
// still work), THEN remove whitespace, THEN match.
const INSTRUCTION_WORDS = [
  "solve", "for", "find", "the", "value", "of", "what", "is",
  "please", "calculate", "determine", "equation"
];

const stripInstructionWords = (text) => {
  // "Solve for x: 3x + 5 = 20" — the equation is almost always whatever
  // comes after the colon, so prefer that over word-stripping when a
  // colon is present.
  let cleaned = text;
  if (cleaned.includes(":")) {
    cleaned = cleaned.split(":").slice(1).join(":");
  }

  // Strip "for x" / "for y" as a whole phrase FIRST — otherwise
  // stripping just "for" (leaving a bare "x") pollutes the equation
  // with a stray extra "x" that breaks every anchored pattern below.
  cleaned = cleaned.replace(/\bfor\s+[a-z]\b/gi, " ");

  for (const word of INSTRUCTION_WORDS) {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
  }
  return cleaned;
};

export const parseLinearEquation = (problem) => {
  const cleaned = stripInstructionWords(problem).replace(/\s+/g, "");

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
