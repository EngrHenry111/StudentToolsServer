import { normalizeText, extractNumbers, hasWords } from "../../../utils/nlp.js";

export const parseSpeed = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  if (hasWords(text, ["speed"]) && nums.length >= 2) {
    return {
      type: "distance",
      speed: nums[0],
      time: nums[1],
    };
  }

  if (hasWords(text, ["km", "distance"]) && nums.length >= 2) {
    return {
      type: "speed",
      distance: nums[0],
      time: nums[1],
    };
  }

  return null;
};