import { normalizeText, extractNumbers } from "../../../utils/nlp.js";

export const parseMixture = (problem) => {
  const text = normalizeText(problem);

  // 🔹 Pattern 1:
  // "mix 5 liters 10% and 5 liters 20%"
  let match = text.match(
    /(\d+)\s*(liters|l)?\s*(\d+)%.*?(\d+)\s*(liters|l)?\s*(\d+)%/
  );

  if (match) {
    return {
      type: "mixture",
      v1: Number(match[1]),
      c1: Number(match[3]),
      v2: Number(match[4]),
      c2: Number(match[6]),
    };
  }

  // 🔹 Pattern 2:
  // "10% of 50 mixed with 20% of 30"
  match = text.match(
    /(\d+)%.*?(\d+).*?(\d+)%.*?(\d+)/
  );

  if (match) {
    return {
      type: "mixture",
      v1: Number(match[2]),
      c1: Number(match[1]),
      v2: Number(match[4]),
      c2: Number(match[3]),
    };
  }

  // 🔹 Fallback (NLP loose)
  const nums = extractNumbers(text);

  if (nums.length === 4) {
    return {
      type: "mixture",
      v1: nums[0],
      c1: nums[1],
      v2: nums[2],
      c2: nums[3],
    };
  }

  return null;
};