import { generatePercentageQuestion } from "../services/mathEngine/quiz/percentageQuiz.js";
import { generateAlgebraQuestion } from "../services/mathEngine/quiz/algebraQuiz.js";

export const generateQuestion = (topic, difficulty) => {
  switch (topic) {
    case "percentage":
      return generatePercentageQuestion(difficulty);

    case "algebra":
      return generateAlgebraQuestion();

    default:
      return generatePercentageQuestion("easy");
  }
};