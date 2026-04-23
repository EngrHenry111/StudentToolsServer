import { hasWords } from "../utils/nlp.js";
const detectTopic = (problem) => {
  const text = problem.toLowerCase();

  
  // 🔹 1. STRICT PATTERNS (HIGH CONFIDENCE)
  if (/\d+%/.test(text)) return "percentage";
  if (/[0-9]*x/.test(text)) return "algebra";
  if (/\d+\/\d+/.test(text)) return "fractions";
  if (text.includes("ratio")) return "ratio";
  if (text.includes("p=") || text.includes("interest")) return "si";
  if (text.includes("n(")) return "set";

  // 🔹 2. WORD-BASED DETECTION (NEW UPGRADE)
  if (
    text.includes("increase") ||
    text.includes("decrease") ||
    text.includes("percent")
  ) return "percentage";

  if (
    text.includes("solve for x") ||
    text.includes("equation")
  ) return "algebra";

  if (
    text.includes("share") ||
    text.includes("divide in ratio")
  ) return "ratio";

  // 🔥 NEW: MOTION / PHYSICS

  if (
    text.includes("km/h") ||
    text.includes("speed") ||
    text.includes("distance") ||
    text.includes("time") ||
    text.includes("travels")
    
  ) return "motion";

  // 🔥 AREA & PERIMETER

if (hasWords(text, ["area", "perimeter", "rectangle", "circle", "triangle" ]))
  return "geometry";

// 🔥 AGE PROBLEMS
if (hasWords(text, ["age", "older", "younger", "mother", "son", "daughter"]))
  return "age";


// 🔥 PROFIT & LOSS
if (
  text.includes("profit") ||
  text.includes("loss") ||
  text.includes("cost price") ||
  text.includes("selling price")
) return "profitloss";

// 🔥 MIXTURE
if (
  text.includes("mix") ||
  text.includes("mixture") ||
  (text.includes("%") && text.includes("and"))
) {
  return "mixture";
}
// if (
//   text.includes("mixture") ||
//   text.includes("concentration") ||
//   text.includes("solution")
// ) return "mixture";

// 🔥 PHYSICS
// if (
//   text.includes("force") ||
//   text.includes("mass") ||
//   text.includes("acceleration") ||
//   text.includes("velocity")
// ) return "physics";
if (hasWords(text, ["force", "mass", "acceleration", "velocity"]))
  return "physics";



// 🔥 AVERAGE
if (hasWords(text, ["average", "mean"]))
  return "average";

// 🔥 INDICES
if (
  text.includes("^") ||
  text.includes("power") ||
  text.includes("index") ||
  text.includes("indices")
) return "indices";

// 🔥 SPEED (alias of motion)
if (
  text.includes("speed") ||
  text.includes("distance") ||
  text.includes("time") ||
  text.includes()
) return "motion";

if (hasWords(text, ["speed", "km", "time", "distance", "km/h"]))
  return "speed";

  // 🔹 3. FALLBACK
  return "general";
};

export default detectTopic;