import { formatResponse } from "../../formatter.js";

const solveSetTheory = (problem) => {
  try {
    const clean = problem.replace(/\s/g, "");

    // 🔥 Extract values
    const get = (key) => {
      const match = clean.match(new RegExp(`${key}=?(\\d+)`));
      return match ? Number(match[1]) : null;
    };

    const nA = get("n\\(A\\)");
    const nB = get("n\\(B\\)");
    const nC = get("n\\(C\\)");
    const nU = get("n\\(U\\)");
    const nAB = get("n\\(A∩B\\)");
    const nAC = get("n\\(A∩C\\)");
    const nBC = get("n\\(B∩C\\)");
    const nABC = get("n\\(A∩B∩C\\)");

    let steps = [];
    let answer;

    // 🔥 CASE 1: TWO SETS UNION
    if (nA && nB && nAB !== null) {
      const union = nA + nB - nAB;

      steps = [
        `Use formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`,
        `${nA} + ${nB} - ${nAB}`,
        `= ${union}`,
      ];

      answer = `n(A ∪ B) = ${union}`;
    }

    // 🔥 CASE 2: COMPLEMENT
    else if (nU && nA !== null) {
      const comp = nU - nA;

      steps = [
        `Complement formula: n(A') = n(U) - n(A)`,
        `${nU} - ${nA} = ${comp}`,
      ];

      answer = `n(A') = ${comp}`;
    }

    // 🔥 CASE 3: THREE SETS
    else if (nA && nB && nC && nAB && nAC && nBC && nABC !== null) {
      const union =
        nA + nB + nC - nAB - nAC - nBC + nABC;

      steps = [
        `n(A ∪ B ∪ C) = n(A)+n(B)+n(C) - n(A∩B) - n(A∩C) - n(B∩C) + n(A∩B∩C)`,
        `${nA} + ${nB} + ${nC} - ${nAB} - ${nAC} - ${nBC} + ${nABC}`,
        `= ${union}`,
      ];

      answer = `n(A ∪ B ∪ C) = ${union}`;
    }

    else {
      return { error: "Unsupported set theory format" };
    }

    return formatResponse({
      topic: "Set Theory",
      formula: "Set formulas",
      steps,
      answer,
      relatedTopics: ["Probability", "Venn Diagram", "Logic", "Algebra"],
    });

  } catch (error) {
    console.error("Set Error:", error);
    return { error: "Solver failed" };
  }
};

export default solveSetTheory;





// import { parseSetProblem } from "./setParser.js";
// import { formatResponse } from "../../formatter.js";


// const solveSetTheory = (problem) => {
//   const parsed = parseSetProblem(problem);

//   if (!parsed) {
//     return { error: "Unsupported set theory format" };
//   }

//   let steps = [];
//   let answer;

//   switch (parsed.type) {

//     // 🔹 2 SETS
//     case "two_sets": {
//       const { A, B, intersection } = parsed;

//       const union = A + B - intersection;

//       steps = [
//         `Formula: n(A ∪ B) = n(A) + n(B) - n(A ∩ B)`,
//         `${A} + ${B} - ${intersection}`,
//         `n(A ∪ B) = ${union}`,
//       ];

//       answer = union;
//       break;
//     }

//     // 🔹 3 SETS
//     case "three_sets": {
//       const { A, B, C, AB, AC, BC, ABC } = parsed;

//       const total = A + B + C - AB - AC - BC + ABC;

//       steps = [
//         `Formula: n(A ∪ B ∪ C) = A + B + C - AB - AC - BC + ABC`,
//         `${A} + ${B} + ${C} - ${AB} - ${AC} - ${BC} + ${ABC}`,
//         `Total = ${total}`,
//       ];

//       answer = total;
//       break;
//     }

//     // 🔹 COMPLEMENT
//     case "complement": {
//       const { U, A } = parsed;

//       const complement = U - A;

//       steps = [
//         `Formula: n(A') = n(U) - n(A)`,
//         `${U} - ${A} = ${complement}`,
//       ];

//       answer = complement;
//       break;
//     }

//     default:
//       return { error: "Unsupported set theory type" };
//   }

//   return formatResponse({
//     topic: "Set Theory",
//     formula: "Set Formulas",
//     steps,
//     answer,
//     relatedTopics: [
//       "Venn Diagrams",
//       "Probability",
//       "Logic",
//     ],
//   });
// };


// export default solveSetTheory;