import { formatResponse } from "../../formatter.js";

const solveSI = (problem) => {
  try {
    // 🔥 Normalize
    const clean = problem.toLowerCase().replace(/\s/g, "");

    const match = clean.match(/p=?(\d+).*r=?(\d+).*t=?(\d+)/);

    if (!match) {
      return { error: "Invalid SI format. Use p=1000 r=5 t=2" };
    }

    const P = Number(match[1]);
    const R = Number(match[2]);
    const T = Number(match[3]);

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



// import { parseSI } from "./siParser..js";
// import { formatResponse } from "../../formatter.js";

// const solveSI = (problem) => {
//   const parsed = parseSI(problem);

//   if (!parsed) return { error: "Unsupported SI format" };

//   const { P, R, T } = parsed;

//   const SI = (P * R * T) / 100;

//   return formatResponse({
//     topic: "Simple Interest",
//     formula: "SI = (P × R × T) / 100",
//     steps: [
//       `SI = (${P} × ${R} × ${T}) / 100`,
//       `SI = ${SI}`,
//     ],
//     answer: SI,
//     relatedTopics: ["Compound Interest"],
//   });
// };


// export default solveSI;