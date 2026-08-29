import { formatResponse } from "../../formatter.js";

// Previously only accepted the literal symbolic format "p=1000 r=5 t=2"
// — a real sentence like "Find the simple interest on 1000 at 5% for 2
// years" has none of those markers and never matched at all. Fix: try
// natural-language extraction (principal after "on"/"of", rate before
// "%", time before "year(s)") before falling back to the p=/r=/t= form.
const solveSI = (problem) => {
  try {
    const text = problem.toLowerCase();

    let P, R, T;

    // Natural language: "...1000 at 5% for 2 years"
    const principalMatch = text.match(/(?:on|of)\s+(\d+(?:\.\d+)?)/) || text.match(/(\d+(?:\.\d+)?)/);
    const rateMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
    const timeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/);

    if (principalMatch && rateMatch && timeMatch) {
      P = Number(principalMatch[1]);
      R = Number(rateMatch[1]);
      T = Number(timeMatch[1]);
    } else {
      // Fallback: symbolic p=.../r=.../t=... format
      const clean = text.replace(/\s/g, "");
      const match = clean.match(/p=?(\d+).*r=?(\d+).*t=?(\d+)/);
      if (!match) {
        return { error: "Could not identify Principal, Rate, and Time in this problem" };
      }
      P = Number(match[1]);
      R = Number(match[2]);
      T = Number(match[3]);
    }

    const SI = (P * R * T) / 100;
    const total = P + SI;

    return formatResponse({
      topic: "Simple Interest",
      formula: "SI = (P × R × T) / 100",
      steps: [
        `P = ${P}, R = ${R}%, T = ${T}`,
        `SI = (${P} × ${R} × ${T}) / 100`,
        `SI = ${SI}`,
        `Total Amount = P + SI = ${P} + ${SI} = ${total}`,
      ],
      answer: `SI = ${SI}, Total = ${total}`,
      relatedTopics: ["Percentage", "Profit & Loss"],
    });

  } catch (error) {
    console.error("SI Error:", error);
    return { error: "Solver failed" };
  }
};

export default solveSI;
