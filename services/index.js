import detectTopic from "./detector.js";

import solvePercentage from "./mathEngine/percentage/percentageSolver.js";
import solveAlgebra from "./mathEngine/algebra/algebraSolver.js";
import solveSetTheory from "./mathEngine/setThreory/setSolver.js";
import solveFractions from "./mathEngine/fraction/fractionSolver.js";
import solveRatio from "./mathEngine/ratio/ratioSolver.js";
import solveSI from "./mathEngine/simpleInterest/siSolver.js";

export const solveMathProblem = (problem) => {
  try {
    const topic = detectTopic(problem);

    
    const solvers = {
  percentage: solvePercentage,
  algebra: solveAlgebra,
  set: solveSetTheory,
  fraction: solveFractions, // ✅ FIXED
  ratio: solveRatio,
  si: solveSI,
};

    const solver = solvers[topic];

    if (!solver) {
      return { error: "Unsupported problem type" };
    }

    const result = solver(problem);

    // 🔒 Ensure valid response
    if (!result || typeof result !== "object") {
      return { error: "Solver failed to return valid response" };
    }

    return result;

  } catch (error) {
    console.error("❌ Engine crash:", error);
    return { error: "Internal solver error" };
  }
};



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