import Question from "../models/questionModel.js";
import { generateAIQuestions } from "./generateAIQuestions.js"; // your AI generator

export const getOrGenerateQuestions = async ({ subject, topic, limit }) => {

  // 1. Get from DB (cache)
  let questions = await Question.find({ subject, topic })
    .sort({ usageCount: 1 })
    .limit(limit);

  // 2. If enough → return immediately
  if (questions.length >= limit) return questions;

  // 3. Generate missing
  const needed = limit - questions.length;

  const newQuestions = await generateAIQuestions({
    subject,
    topic,
    count: needed
  });

  // 4. Save to DB
  const saved = await Question.insertMany(newQuestions);

  // 5. Return combined
  return [...questions, ...saved];
};