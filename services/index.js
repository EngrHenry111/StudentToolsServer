import detectTopic from "./detector.js";
import { evaluate } from "mathjs";

import solvePercentage from "./mathEngine/percentage/percentageSolver.js";
import solveAlgebra from "./mathEngine/algebra/algebraSolver.js";
import solveSetTheory from "./mathEngine/setThreory/setSolver.js";
import solveFractions from "./mathEngine/fraction/fractionSolver.js";
import solveRatio from "./mathEngine/ratio/ratioSolver.js";
import solveSI from "./mathEngine/simpleInterest/siSolver.js";

import solveAverage from "./mathEngine/average/averageSolver.js";
import solveSpeed from "./mathEngine/speed/speedSolver.js";
import solveIndices from "./mathEngine/indices/indicesSolver.js";
import solveSimultaneous from "./mathEngine/simultaneous/simultaneousSolver.js";

import solveMotion from "./mathEngine/motion/motionSolver.js";

import solveGeometry from "./mathEngine/geometry/geometrySolver.js";
import solveAge from "./mathEngine/age/ageSolver.js";
import solveProfitLoss from "./mathEngine/profitLoss/profiltLossSolver.js";
import solveMixture from "./mathEngine/mixture/mixtureSolver.js";
import solvePhysics from "./mathEngine/physics/physicsSolver.js";




export const solveMathProblem = (problem) => {
  try {
    const topic = detectTopic(problem);

    const solvers = {
      percentage: solvePercentage,
      algebra: solveAlgebra,
      set: solveSetTheory,
      fractions: solveFractions,
      ratio: solveRatio,
      si: solveSI,
      motion: solveMotion,

        // 🔥 NEW
      average: solveAverage,
      speed_distance: solveSpeed,
      indices: solveIndices,
      simultaneous: solveSimultaneous,


      geometry: solveGeometry,
      age: solveAge,
      profitloss: solveProfitLoss,
      mixture: solveMixture,
      physics: solvePhysics,
    };

    // 🔥 STEP 1: Try specific solver
    if (solvers[topic]) {
      const result = solvers[topic](problem);
      if (!result.error) return result;
    }

    // 🔥 STEP 2: FALLBACK → general math engine
    try {
      const clean = problem
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      const answer = evaluate(clean);

      return {
        success: true,
        topic: "General Math",
        formula: "Expression Evaluation",
        steps: [
          `Rewrite expression: ${clean}`,
          `Evaluate using math engine`,
        ],
        answer,
        relatedTopics: ["Algebra", "Fractions"],
      };

    } catch (err) {
      return { error: "Unsupported or invalid problem" };
    }

  } catch (error) {
    console.error("❌ Engine crash:", error);
    return { error: "Internal solver error" };
  }
};


// export const solveMathProblem = (problem) => {
//   try {
//     const topic = detectTopic(problem);

    
//     const solvers = {
//   percentage: solvePercentage,
//   algebra: solveAlgebra,
//   set: solveSetTheory,
//   fraction: solveFractions, // ✅ FIXED
//   ratio: solveRatio,
//   si: solveSI,
// };

//     const solver = solvers[topic];

//     if (!solver) {
//       return { error: "Unsupported problem type" };
//     }

//     const result = solver(problem);

//     // 🔒 Ensure valid response
//     if (!result || typeof result !== "object") {
//       return { error: "Solver failed to return valid response" };
//     }

//     return result;

//   } catch (error) {
//     console.error("❌ Engine crash:", error);
//     return { error: "Internal solver error" };
//   }
// };



// import detectTopic from "./detector.js";
// import solvePercentage from "./mathEngine/percentage/percentageSolver.js";
// import solveAlgebra from "./mathEngine/algebra/algebraSolver.js";
// import solveSetTheory from "./mathEngine/setThreory/setSolver.js";

// import solveFractions from "./mathEngine/fraction/fractionSolver.js";
// import solveRatio from "./mathEngine/ratio/ratioSolver.js";
// import solveSI from "./mathEngine/simpleInterest/siSolver.js";

// export const solveMathProblem = (problem) => {
//   const topic = detectTopic(problem);

//   switch (topic) {
//     case "percentage":
//       return solvePercentage(problem);

//     case "algebra":
//       return solveAlgebra(problem);

//     case "set":
//       return solveSetTheory(problem);

//       case "fractions":
//   result = solveFractions(problem);
//   break;

// case "ratio":
//   result = solveRatio(problem);
//   break;

// case "si":
//   result = solveSI(problem);
//   break;

//     default:
//       return {
//         error: "Unsupported problem type",
//       };
//   }
// };