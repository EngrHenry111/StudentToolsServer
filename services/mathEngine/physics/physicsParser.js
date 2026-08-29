export const parsePhysics = (problem) => {
  const text = problem.toLowerCase();

  // 🔹 Extract numbers WITH context — previously only accepted "mass is
  // 10" or "mass=10" directly; real phrasing like "mass of 2kg" (with
  // "of" as the connector) silently failed to match at all, since "of"
  // wasn't one of the accepted connector words.
  const massMatch = text.match(/mass\s*(?:is|=|of)?\s*(\d+(?:\.\d+)?)/);
  const forceMatch = text.match(/force\s*(?:is|=|of)?\s*(\d+(?:\.\d+)?)/);
  const accMatch = text.match(/acceleration\s*(?:is|=|of)?\s*(\d+(?:\.\d+)?)/);

  const mass = massMatch ? parseFloat(massMatch[1]) : null;
  const force = forceMatch ? parseFloat(forceMatch[1]) : null;
  const acceleration = accMatch ? parseFloat(accMatch[1]) : null;

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