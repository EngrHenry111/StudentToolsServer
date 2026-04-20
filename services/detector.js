const detectTopic = (problem) => {
  const text = problem.toLowerCase();

  // EXISTING
  if (text.includes("%")) return "percentage";
  if (text.includes("x")) return "algebra";
  if (text.includes("/")) return "fractions";
  if (text.includes("ratio")) return "ratio";
  if (text.includes("interest")) return "si";
  if (text.includes("n(")) return "set";

  // 🔥 NEW TOPICS
  if (text.includes("average")) return "average";
  if (text.includes("km") || text.includes("speed")) return "speed_distance";
  if (text.includes("^")) return "indices";
  if (text.includes("log")) return "logarithm";
  if (text.includes("simultaneous")) return "simultaneous";

  return "general";
};

export default detectTopic;

// const detectTopic = (problem) => {
//   problem = problem.toLowerCase();

//   if (problem.includes("%")) return "percentage";

//   if (/[xyz]/.test(problem)) return "algebra";

//   if (problem.includes("n(")) return "set";

//   if (problem.includes("/") && /[\+\-\*÷×]/.test(problem)) {
//     return "fraction"; // ✅ MUST MATCH
//   }

//   if (problem.includes("ratio")) return "ratio";

//   if (problem.includes("p=") && problem.includes("r=")) return "si";

//   return "unknown";
// };

// export default detectTopic;

// // import { normalizeInput } from "../utils/helper.js";

// // const detectTopic = (problem) => {
// //   const text = normalizeInput(problem);

// //   if (text.includes("%")) return "percentage";

// //   if (text.includes("x") && text.includes("=")) return "algebra";

// //   if (
// //     text.includes("n(") ||
// //     text.includes("∪") ||
// //     text.includes("∩")
// //   ) return "set";

// //   if (text.includes("/")) return "fractions";

// //   if (text.includes("ratio")) return "ratio";

// //   if (text.includes("p=") || text.includes("simple interest"))
// //     return "si";

// //   return "unknown";
// // };

// // export default detectTopic;


// // import { normalizeInput, contains } from "../utils/helper.js";

// // const detectTopic = (problem) => {
// //   const text = normalizeInput(problem);

// //   if (text.includes("%")) return "percentage";

// //   if (contains(text, ["x", "="])) return "algebra";

// //   if (contains(text, ["union", "∪", "intersection", "∩"])) {
// //     return "set";
// //   }

// //   return "unknown";
// // };

// // export default detectTopic;