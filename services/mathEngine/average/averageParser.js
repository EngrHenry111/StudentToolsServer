import { normalizeText, extractNumbers } from "../../../utils/nlp.js";

export const parseAverage = (problem) => {
  const text = normalizeText(problem);
  const nums = extractNumbers(text);

  if (text.includes("average") || text.includes("mean")) {
    return {
      type: "mean",
      values: nums,
    };
  }

  return null;
};