import  generatePercentageQuestion  from "../services/mathEngine/quiz/percentageQuiz.js";
import  generateAlgebraQuestion  from "../services/mathEngine/quiz/algebraQuiz.js";
import { generateFractionQuestion } from "../services/mathEngine/quiz/fractionQuiz.js";
import { generateRatioQuestion } from "../services/mathEngine/quiz/ratioQuiz.js";
import { generateSimpleInterestQuestion } from "../services/mathEngine/quiz/simpleInterestQuiz.js";
import { generateSetTheoryQuestion } from "../services/mathEngine/quiz/setQuiz.js";


// 🔥 NEW
import generateAverageQuestion from "../services/mathEngine/quiz/avarageQuiz.js";
import generateSpeedQuestion from "../services/mathEngine/quiz/speedQuiz.js";
import generateIndicesQuestion from "../services/mathEngine/quiz/indicesQuiz.js";
import generateSimultaneousQuestion from "../services/mathEngine/quiz/simpleInterestQuiz.js";

export const generateQuestion = (topic, difficulty) => {
  switch (topic) {
    case "percentage":
      return generatePercentageQuestion(difficulty);

    case "algebra":
      return generateAlgebraQuestion(difficulty);

    case "fractions":
      return generateFractionQuestion(difficulty);

    case "ratio":
      return generateRatioQuestion(difficulty);

    case "interest":
      return generateSimpleInterestQuestion(difficulty);

    case "set":
      return generateSetTheoryQuestion(difficulty);

    // 🔥 NEW
    case "average":
      return generateAverageQuestion(difficulty);

    case "speed_distance":
      return generateSpeedQuestion(difficulty);

    case "indices":
      return generateIndicesQuestion(difficulty);

    case "simultaneous":
      return generateSimultaneousQuestion(difficulty);

    default:
      return generatePercentageQuestion("easy");
  }
};

// export const generateQuestion = (topic, difficulty) => {
//   switch (topic) {
//     case "percentage":
//       return generatePercentageQuestion(difficulty);

//     case "algebra":
//       return generateAlgebraQuestion(difficulty);

//     case "fractions":
//       return generateFractionQuestion(difficulty);

//     case "ratio":
//       return generateRatioQuestion(difficulty);

//     case "interest":
//       return generateSimpleInterestQuestion(difficulty);

//     case "set":
//       return generateSetTheoryQuestion(difficulty);

//     default:
//       return generatePercentageQuestion("easy");
//   }

  
// };