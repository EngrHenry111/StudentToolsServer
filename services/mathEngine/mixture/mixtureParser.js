import { normalizeText, extractNumbers } from "../../../utils/nlp.js";

export const parseMixture = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  // works for ANY structure
  // "mix 5L 10% and 5L 20%"
  // "10% of 50 mixed with 20% of 30"

  if (nums.length >= 4) {
    return {
      v1: nums[0],
      c1: nums[1],
      v2: nums[2],
      c2: nums[3],
    };
  }

  return null;
};