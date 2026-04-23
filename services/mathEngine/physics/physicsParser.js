import { normalizeText, extractNumbers, hasWords } from "../../../utils/nlp.js";

export const parsePhysics = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  if (hasWords(text, ["force", "mass", "acceleration"])) {
    if (nums.length >= 2) {
      return {
        type: "force",
        mass: nums[0],
        acceleration: nums[1],
      };
    }
  }

  return null;
};