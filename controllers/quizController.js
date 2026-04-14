import { generateQuestion } from "../services/mathEngine/quiz/questionBank.js";

export const getQuizQuestion = (req, res) => {
  const { topic } = req.query;

  const question = generateQuestion(topic);

  res.json(question);
};