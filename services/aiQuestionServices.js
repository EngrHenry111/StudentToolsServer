import Question from "../models/questionModel.js";
import { generateAIQuestions } from "./generateAIQuestion.js";

export const getOrGenerateQuestions = async ({ subject, topic, limit }) => {

  // 1. Check DB first
  let questions = await Question.find({ subject, topic })
    .limit(limit);

  // 2. If enough cached questions exist
  if (questions.length >= limit) {
    return questions;
  }

  // 3. Decide how many to generate (BATCH SIZE CONTROL)
  const batchSize = Math.max(5, limit); // always generate at least 5

  const newQuestions = await generateAIQuestions({
    subject,
    topic,
    count: batchSize
  });

  // 4. Save all at once (important optimization)
  const saved = await Question.insertMany(newQuestions);

  // 5. Return only what is needed
  return [...questions, ...saved].slice(0, limit);
};