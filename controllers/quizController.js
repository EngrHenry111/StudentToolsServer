import QuizProgress from "../models/QuizProgress.js";
import { generateQuestion } from "../services/quetionFactory.js";

export const getQuizQuestion = (req, res) => {
  const { topic = "percentage", difficulty = "easy" } = req.query;

  const question = generateQuestion(topic, difficulty);

  res.json(question);
};

export const submitQuizAnswer = async (req, res) => {
  try {
    const { username = "Guest", isCorrect, topic } = req.body;

    let user = await QuizProgress.findOne({ username, topic });

    if (!user) {
      user = await QuizProgress.create({ username, topic });
    }

    user.attempts += 1;

    if (isCorrect) {
      user.correct += 1;
      user.score += 10;
      user.streak += 1;
    } else {
      user.streak = 0;
    }

    await user.save();

    res.json({
      message: "Progress updated",
      score: user.score,
      streak: user.streak,
      attempts: user.attempts,
    });

  } catch (error) {
    res.status(500).json({ message: "Submit failed" });
  }
};

export const getLeaderboard = async (req, res) => {
  const users = await QuizProgress.find()
    .sort({ score: -1 })
    .limit(10);

  res.json(users);
};