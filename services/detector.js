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
if (
  text.includes("area") ||
  text.includes("perimeter") ||
  text.includes("rectangle") ||
  text.includes("circle") ||
  text.includes("triangle")
) return "geometry";

// 🔥 AGE PROBLEMS
// if (
//   text.includes("years old") ||
//   text.includes("age") ||
//   text.includes("younger") ||
//   text.includes("older")
// ) return "age";
if (
  text.includes("age") ||
  text.includes("older") ||
  text.includes("younger") ||
  text.includes("father") ||
  text.includes("mother") ||
  text.includes("son") ||
  text.includes("daughter")
) return "age";

// 🔥 PROFIT & LOSS
if (
  text.includes("profit") ||
  text.includes("loss") ||
  text.includes("cost price") ||
  text.includes("selling price")
) return "profitloss";

// 🔥 MIXTURE
if (
  text.includes("mixture") ||
  text.includes("mix") ||
  text.includes("%") && text.includes("liters")
) return "mixture";
// if (
//   text.includes("mixture") ||
//   text.includes("concentration") ||
//   text.includes("solution")
// ) return "mixture";

// 🔥 PHYSICS
if (
  text.includes("force") ||
  text.includes("mass") ||
  text.includes("acceleration") ||
  text.includes("velocity")
) return "physics";


// 🔥 AVERAGE
if (
  text.includes("average") ||
  text.includes("mean")
) return "average";

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
  text.includes("km/h")
) return "motion";

  // 🔹 3. FALLBACK
  return "general";
};

export default detectTopic;