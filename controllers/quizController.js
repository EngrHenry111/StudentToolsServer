import { generateQuestion } from "../services/quetionFactory.js";

export const getQuizQuestion = (req, res) => {
  try {
    const { topic = "percentage", difficulty = "easy" } = req.query;

    const question = generateQuestion(topic, difficulty);

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};