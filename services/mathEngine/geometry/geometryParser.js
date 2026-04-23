import { normalizeText, extractNumbers, hasWords } from "../../../utils/nlp.js";

export const parseGeometry = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  if (hasWords(text, ["area"]) && nums.length >= 2) {
    return {
      type: "area_rectangle",
      length: nums[0],
      width: nums[1],
    };
  }

  if (hasWords(text, ["perimeter"]) && nums.length >= 2) {
    return {
      type: "perimeter_rectangle",
      length: nums[0],
      width: nums[1],
    };
  }

  return null;
};