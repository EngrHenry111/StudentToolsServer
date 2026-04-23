import { normalizeText, extractNumbers, hasWords } from "../../../utils/nlp.js";

export const parseAge = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  if (hasWords(text, ["age", "older", "younger"])) {
    if (nums.length >= 2) {
      return {
        type: "difference",
        a: nums[0],
        b: nums[1],
      };
    }
  }

  return null;
};