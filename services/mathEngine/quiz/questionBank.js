import { generatePercentageQuestion } from "./questionGenerator.js";

export const generateQuestion = (topic) => {

  switch (topic) {
    case "percentage":
      return generatePercentageQuestion();

    default:
      return generatePercentageQuestion();
  }

};