const detectTopic = (problem) => {
  problem = problem.toLowerCase();

  if (problem.includes("%")) return "percentage";
  if (problem.includes("x")) return "algebra";
  if (problem.includes("ratio")) return "ratio";
  if (problem.includes("interest") || problem.includes("p=")) return "si";
  if (problem.includes("n(")) return "set";
  if (problem.includes("/") || problem.includes("fraction")) return "fractions";

  // 🔥 NEW: SPEED / DISTANCE / TIME
  if (
    problem.includes("km/h") ||
    problem.includes("speed") ||
    problem.includes("distance") ||
    problem.includes("time")
  ) {
    return "motion";
  }

  return "general";
};

export default detectTopic;