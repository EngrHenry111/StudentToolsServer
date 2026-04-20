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

  // 🔹 3. FALLBACK
  return "general";
};

export default detectTopic;