import { evaluate } from "mathjs";

import universalParser from "./universal/universalParser.js";

// 🔥 EXISTING SOLVERS
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

    // 🔥 UNIVERSAL AI PARSER
    const parsed = universalParser(problem);

    const topic = parsed.topic;

    console.log("📥 Problem:", problem);
    console.log("🧠 Parsed:", parsed);

    const solvers = {

      percentage: solvePercentage,
      algebra: solveAlgebra,
      set: solveSetTheory,
      fractions: solveFractions,
      ratio: solveRatio,
      si: solveSI,

      average: solveAverage,
      speed_distance: solveSpeed,
      indices: solveIndices,
      simultaneous: solveSimultaneous,

      motion: solveMotion,

      geometry: solveGeometry,
      age: solveAge,
      profitloss: solveProfitLoss,
      mixture: solveMixture,
      physics: solvePhysics,
    };

    // 🔥 TOPIC SOLVER
    if (solvers[topic]) {

      // ✅ SEND PARSED OBJECT
      const result = solvers[topic](parsed);

      if (result && !result.error) {
        return result;
      }
    }

    // 🔥 UNIVERSAL FALLBACK
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
          `Evaluate mathematically`
        ],
        answer,
        relatedTopics: ["Arithmetic"]
      };

    } catch {

      return {
        success: false,
        message: "Unsupported or unclear problem",
      };
    }

  } catch (error) {

    console.error("❌ Engine crash:", error);

    return {
      success: false,
      message: "Internal solver error",
    };
  }
};