import { parsePhysics } from "../../mathEngine/physics/physicsParser.js";
import { formatResponse } from "../../formatter.js";

const solvePhysics = (problem) => {
  const parsed = parsePhysics(problem);

  if (!parsed) {
    return { error: "Unsupported physics problem" };
  }

  let steps = [];
  let answer;

  switch (parsed.type) {

    // 🔹 FIND FORCE
    case "findForce": {
      const { mass, acceleration } = parsed;
      const force = mass * acceleration;

      steps = [
        `Formula: Force = Mass × Acceleration`,
        `F = ${mass} × ${acceleration}`,
        `F = ${force} N`
      ];

      answer = `${force} N`;
      break;
    }

    // 🔹 FIND ACCELERATION
    case "findAcceleration": {
      const { force, mass } = parsed;
      const acceleration = force / mass;

      steps = [
        `Formula: Acceleration = Force / Mass`,
        `a = ${force} / ${mass}`,
        `a = ${acceleration} m/s²`
      ];

      answer = `${acceleration} m/s²`;
      break;
    }

    // 🔹 FIND MASS
    case "findMass": {
      const { force, acceleration } = parsed;
      const mass = force / acceleration;

      steps = [
        `Formula: Mass = Force / Acceleration`,
        `m = ${force} / ${acceleration}`,
        `m = ${mass} kg`
      ];

      answer = `${mass} kg`;
      break;
    }

    default:
      return { error: "Unsupported physics type" };
  }

  return formatResponse({
    topic: "Physics",
    formula: "F = m × a",
    steps,
    answer,
    relatedTopics: ["Motion", "Force", "Acceleration"]
  });
};

export default solvePhysics;