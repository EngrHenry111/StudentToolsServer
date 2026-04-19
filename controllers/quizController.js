import QuizProgress from "../models/QuizProgress.js";
import { generateQuestion } from "../services/quetionFactory.js";

// import { generateQuizQuestion } from "../services/quizEngine/index.js";
import { solveMathProblem } from "../services/index.js"; // 🔥 reuse your solver

// 🎯 GET QUESTION (Adaptive)
export const getQuizQuestion = async (req, res) => {
  try {
    const { topic = "percentage", username = "Guest" } = req.query;

    let user = await QuizProgress.findOne({ username, topic });

    let difficulty = "easy";

    if (user) {
      if (user.streak >= 5) difficulty = "hard";
      else if (user.streak >= 2) difficulty = "medium";
    }

    const question = generateQuestion(topic, difficulty);

    res.json(question);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get question" });
  }
};


export const submitQuizAnswer = async (req, res) => {
  try {
    const { username = "Guest", isCorrect, topic, problem } = req.body;

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

    // 🔥 SOLUTION ENGINE (KEY FEATURE)
    let solution = null;

    if (!isCorrect && problem) {
      const solved = solveMathProblem(problem);

      if (!solved.error) {
        solution = {
          steps: solved.steps,
          answer: solved.answer,
          formula: solved.formula,
        };
      }
    }

    res.json({
      message: "Progress updated",
      score: user.score,
      streak: user.streak,
      attempts: user.attempts,
      solution, // 🔥 NEW
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submit failed" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaders = await QuizProgress.aggregate([
      {
        $group: {
          _id: "$username",
          totalScore: { $sum: "$score" },
          totalAttempts: { $sum: "$attempts" },
          totalCorrect: { $sum: "$correct" },
          streak: { $max: "$streak" },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // 🔥 Format clean response
    const formatted = leaders.map((u) => ({
      username: u._id,
      score: u.totalScore,
      attempts: u.totalAttempts,
      correct: u.totalCorrect,
      streak: u.streak,
    }));

    res.json(formatted);

  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};