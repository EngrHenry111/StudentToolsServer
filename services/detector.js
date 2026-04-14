import { normalizeInput } from "../utils/helper.js";

const detectTopic = (problem) => {
  const text = normalizeInput(problem);

  if (text.includes("%")) return "percentage";

  if (text.includes("x") && text.includes("=")) return "algebra";

  if (
    text.includes("n(") ||
    text.includes("∪") ||
    text.includes("∩")
  ) return "set";

  if (text.includes("/")) return "fractions";

  if (text.includes("ratio")) return "ratio";

  if (text.includes("p=") || text.includes("simple interest"))
    return "si";

  return "unknown";
};

export default detectTopic;


// import { normalizeInput, contains } from "../utils/helper.js";

// const detectTopic = (problem) => {
//   const text = normalizeInput(problem);

//   if (text.includes("%")) return "percentage";

//   if (contains(text, ["x", "="])) return "algebra";

//   if (contains(text, ["union", "∪", "intersection", "∩"])) {
//     return "set";
//   }

//   return "unknown";
// };

// export default detectTopic;