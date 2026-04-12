import detectTopic from "./detector.js";
import solvePercentage from "./mathEngine/percentage/percentageSolver.js";
import solveAlgebra from "./mathEngine/algebra/algebraSolver.js";
import solveSetTheory from "./mathEngine/setThreory/setSolver.js";

import solveFractions from "./mathEngine/fraction/fractionSolver.js";
import solveRatio from "./mathEngine/ratio/ratioSolver.js";
import solveSI from "./mathEngine/simpleInterest/siSolver.js";

export const solveMathProblem = (problem) => {
  const topic = detectTopic(problem);

  switch (topic) {
    case "percentage":
      return solvePercentage(problem);

    case "algebra":
      return solveAlgebra(problem);

    case "set":
      return solveSetTheory(problem);

      case "fractions":
  result = solveFractions(problem);
  break;

case "ratio":
  result = solveRatio(problem);
  break;

case "si":
  result = solveSI(problem);
  break;

    default:
      return {
        error: "Unsupported problem type",
      };
  }
};