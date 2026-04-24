export const parsePhysics = (problem) => {
  const text = problem.toLowerCase();

  // 🔹 Extract numbers WITH context
  const massMatch = text.match(/mass\s*(is|=)?\s*(\d+(\.\d+)?)/);
  const forceMatch = text.match(/force\s*(is|=)?\s*(\d+(\.\d+)?)/);
  const accMatch = text.match(/acceleration\s*(is|=)?\s*(\d+(\.\d+)?)/);

  const mass = massMatch ? parseFloat(massMatch[2]) : null;
  const force = forceMatch ? parseFloat(forceMatch[2]) : null;
  const acceleration = accMatch ? parseFloat(accMatch[2]) : null;

  // 🔥 Detect what to find
  if (text.includes("find force") || text.includes("calculate force") || text.includes("what is force")) {
    if (mass && acceleration) {
      return { type: "findForce", mass, acceleration };
    }
  }

  if (text.includes("find acceleration") || text.includes("calculate acceleration")) {
    if (force && mass) {
      return { type: "findAcceleration", force, mass };
    }
  }

  if (text.includes("find mass") || text.includes("calculate mass")) {
    if (force && acceleration) {
      return { type: "findMass", force, acceleration };
    }
  }

  // 🔥 AUTO-DETECT (NO "find" WORD)
  if (mass && acceleration && !force) {
    return { type: "findForce", mass, acceleration };
  }

  if (force && mass && !acceleration) {
    return { type: "findAcceleration", force, mass };
  }

  if (force && acceleration && !mass) {
    return { type: "findMass", force, acceleration };
  }

  return null;
};