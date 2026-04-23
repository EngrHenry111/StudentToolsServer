import { parseMixture } from "../../mathEngine/mixture/mixtureParser.js";
import { formatResponse } from "../../formatter.js";

const solveMixture = (problem) => {
  const parsed = parseMixture(problem);

  if (!parsed) {
    return { error: "Could not understand mixture problem" };
  }

  const { v1, c1, v2, c2 } = parsed;

  if ([v1, c1, v2, c2].some((v) => isNaN(v))) {
    return { error: "Invalid values in mixture problem" };
  }

  const totalVolume = v1 + v2;

  const totalSolute =
    (v1 * c1) / 100 + (v2 * c2) / 100;

  const finalConcentration =
    (totalSolute / totalVolume) * 100;

  return formatResponse({
    topic: "Mixture",
    formula: "Final% = (Total Solute / Total Volume) × 100",
    steps: [
      `Solution 1: ${v1}L at ${c1}%`,
      `Solution 2: ${v2}L at ${c2}%`,
      `Total Volume = ${v1} + ${v2} = ${totalVolume}`,
      `Total Solute = (${v1}×${c1}/100) + (${v2}×${c2}/100)`,
      `= ${totalSolute}`,
      `Final Concentration = (${totalSolute}/${totalVolume}) × 100`,
      `= ${finalConcentration}%`,
    ],
    answer: `${finalConcentration}%`,
  });
};

export default solveMixture;