import { hasWords } from "../utils/nlp.js";

// Detection order matters enormously here — this was previously checking
// weak, generic signals FIRST (any percent sign anywhere, any letter "x"
// anywhere) before strong, specific ones (age words, motion units,
// geometry shapes). That meant, for example, "a boy is six years older
// than his sister" got misrouted to algebra just because "six" contains
// the letter "x". The fix: check the most specific, reliable signals
// first, and only fall back to loose pattern-matching at the very end.
const detectTopic = (problem) => {
  const text = problem.toLowerCase();

  // ===================== 1. HIGH-CONFIDENCE, SPECIFIC WORD SIGNALS =====================
  // These phrases are unlikely to appear in an unrelated problem, so they
  // run before any loose symbol-based checks.

  if (hasWords(text, ["age", "older", "younger", "years old"]) &&
      hasWords(text, ["mother", "son", "daughter", "father", "sister", "brother", "years", "old", "older", "younger"])) {
    return "age";
  }

  if (hasWords(text, ["profit", "loss", "cost price", "selling price", "cp", "sp"])) {
    return "profitloss";
  }

  if (hasWords(text, ["mixture", "mixed", "alloy", "solution"]) ||
      (text.includes("%") && hasWords(text, ["mix", "blend"]))) {
    return "mixture";
  }

  if (hasWords(text, ["force", "mass", "acceleration", "newton", "momentum"])) {
    return "physics";
  }

  if (hasWords(text, ["area", "perimeter", "rectangle", "circle", "triangle", "square", "circumference", "radius", "volume"])) {
    return "geometry";
  }

  if (hasWords(text, ["average", "mean"])) {
    return "average";
  }

  if (hasWords(text, ["speed", "km/h", "mph", "velocity", "travels", "distance", "kilometres", "kilometers"]) &&
      hasWords(text, ["time", "hour", "hours", "minute", "minutes", "speed", "distance"])) {
    return "motion";
  }

  if (text.includes("n(") || hasWords(text, ["union", "intersection"])) {
    return "set";
  }

  if (hasWords(text, ["interest"]) || text.includes("p=") || text.includes("principal")) {
    return "si";
  }

  if (hasWords(text, ["ratio", "divide in the ratio", "share in the ratio"])) {
    return "ratio";
  }

  if (hasWords(text, ["power", "index", "indices", "exponent"]) || /\d\^\d/.test(text)) {
    return "indices";
  }

  if (hasWords(text, ["simultaneous"]) ||
      ((text.match(/=/g) || []).length >= 2 && hasWords(text, ["and"]))) {
    return "simultaneous";
  }

  // ===================== 2. STRUCTURAL / SYMBOLIC PATTERNS =====================
  // These are checked after word-based signals, since symbols alone are
  // more ambiguous (a percent sign can appear in a mixture or profit/loss
  // problem too — those are now caught above, before this runs).

  // Polynomial: genuine algebraic expression structure — bracket
  // multiplication like (x+2)(x-3), or a variable raised to a power.
  if (/\([a-z0-9+\- ]+\)\s*\([a-z0-9+\- ]+\)/i.test(text) || /[a-z]\^\d/i.test(text)) {
    return "polynomial";
  }

  // Algebra: requires an actual equation structure (an "=" sign
  // together with a variable letter — either standalone like "x = 5"
  // or attached to a coefficient like "3x = 15"), OR explicit "solve"/
  // "equation" wording. NOT just the presence of the letter "x"
  // anywhere in the text (that was the original catastrophic bug).
  if (
    (text.includes("=") && /[a-z]/i.test(text)) ||
    hasWords(text, ["solve for x", "solve for y", "equation"])
  ) {
    return "algebra";
  }

  if (hasWords(text, ["increase", "decrease", "percent", "percentage"]) || /\d+\s*%/.test(text)) {
    return "percentage";
  }

  // Fractions: either an explicit "a/b [op] c/d" structural pattern
  // (unambiguous on its own — this exact shape doesn't occur by
  // accident in other topics), or a bare "a/b" together with wording
  // that confirms it's meant as a fraction operation.
  if (/\b\d+\/\d+\s*[+\-*]\s*\d+\/\d+\b/.test(text)) {
    return "fractions";
  }
  if (/\b\d+\/\d+\b/.test(text) && hasWords(text, ["fraction", "of", "add", "sum", "plus", "minus", "subtract"])) {
    return "fractions";
  }

  // ===================== 3. FALLBACK =====================
  return "general";
};

export default detectTopic;
