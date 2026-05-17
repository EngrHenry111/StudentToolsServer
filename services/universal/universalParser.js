import normalizeText from "./normalizeText.js";
import detectIntent from "./intentDetector.js";
import { extractVariables } from "./variableExtractor.js";

const universalParser = (problem) => {

  const text = normalizeText(problem);

  const variables = extractVariables(text);

  const intent = detectIntent(text);

  // 🔥 POLYNOMIAL / ALGEBRAIC EXPRESSIONS
if (
  text.includes("(") &&
  text.includes(")") &&
  /[a-z]/i.test(text)
) {
  return {
    topic: "polynomial",
    intent: "expand",
    variables: {},
    text,
  };
}

  let topic = "general";

  // 🔥 TOPIC DETECTION

  if (
    text.includes("force") ||
    text.includes("mass") ||
    text.includes("acceleration")
  ) {
    topic = "physics";
  }

  else if (
    text.includes("speed") ||
    text.includes("distance") ||
    text.includes("time")
  ) {
    topic = "motion";
  }

  else if (
    text.includes("area") ||
    text.includes("perimeter")
  ) {
    topic = "geometry";
  }

  else if (
    text.includes("%")
  ) {
    topic = "percentage";
  }

  else if (
    text.includes("interest")
  ) {
    topic = "si";
  }

  else if (
    /\d+\/\d+/.test(text)
  ) {
    topic = "fractions";
  }

  return {
    topic,
    intent,
    variables,
    text,
  };
};

export default universalParser;