import { normalizeInput, contains } from "../utils/helper.js";

const detectTopic = (problem) => {
  const text = normalizeInput(problem);

  if (text.includes("%")) return "percentage";

  if (contains(text, ["x", "="])) return "algebra";

  if (contains(text, ["union", "∪", "intersection", "∩"])) {
    return "set";
  }

  return "unknown";
};

export default detectTopic;