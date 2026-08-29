import { normalizeText, hasWords } from "../../../utils/nlp.js";

// Small cardinal-number words are common in age problems ("six years
// older") but the raw text has no digits for them at all until
// converted first.
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20
};

const wordsToDigits = (text) => {
  let result = text;
  for (const [word, digit] of Object.entries(NUMBER_WORDS)) {
    result = result.replace(new RegExp(`\\b${word}\\b`, "gi"), String(digit));
  }
  return result;
};

export const parseAge = (problem) => {
  const text = normalizeText(wordsToDigits(problem));

  if (!hasWords(text, ["age", "older", "younger"])) {
    return null;
  }

  // Most real age problems have the shape "X is [delta] years older/
  // younger than Y, who is [base] years old" — the earlier version
  // just grabbed the first two numbers anywhere in the text and
  // subtracted them, which happened to accidentally work only when a
  // problem gave both ages directly, and gave a nonsense answer for
  // this far more common phrasing (e.g. computing |6-10|=4 instead of
  // recognizing "6 years older than someone who is 10" means 16).
  const deltaMatch = text.match(/(\d+(?:\.\d+)?)\s*years?\s*(older|younger)\s*than/);
  const baseMatch = text.match(/(\d+(?:\.\d+)?)\s*years?\s*old\b/);

  if (deltaMatch && baseMatch) {
    return {
      type: "relative",
      delta: Number(deltaMatch[1]),
      direction: deltaMatch[2],
      base: Number(baseMatch[1]),
    };
  }

  // Fallback: two ages given directly ("John is 15, Mary is 10, find
  // the age difference") — no "older than X" structure, just a
  // straightforward difference.
  const allNums = text.match(/\d+(?:\.\d+)?/g);
  if (allNums && allNums.length >= 2) {
    return {
      type: "difference",
      a: Number(allNums[0]),
      b: Number(allNums[1]),
    };
  }

  return null;
};
