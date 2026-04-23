import { parseMixture } from "../../mathEngine/mixture/mixtureParser.js";
import { formatResponse } from "../../formatter.js";

const solveMixture = (problem) => {
  const parsed = parseMixture(problem);

  if (!parsed) return { error: "Invalid mixture problem" };

  const totalVolume = parsed.v1 + parsed.v2;
  const totalContent =
    (parsed.v1 * parsed.c1 + parsed.v2 * parsed.c2) / 100;

  const concentration = (totalContent / totalVolume) * 100;

  return formatResponse({
    topic: "Mixture",
    formula: "Final% = (Total Solute / Total Volume) × 100",
    steps: [
      `Volume1 = ${parsed.v1}, Concentration1 = ${parsed.c1}%`,
      `Volume2 = ${parsed.v2}, Concentration2 = ${parsed.c2}%`,
      `Total Volume = ${totalVolume}`,
      `Total Solute = (${parsed.v1}×${parsed.c1} + ${parsed.v2}×${parsed.c2}) / 100`,
      `Final Concentration = ${concentration}%`,
    ],
    answer: `${concentration}%`,
  });
};

export default solveMixture;