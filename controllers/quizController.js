import QuizProgress from "../models/QuizProgress.js";
import TopicPerformance from "../models/topicPerformance.js";

import { generateQuestion } from "../services/quetionFactory.js";

import { solveMathProblem } from "../services/index.js"; // 🔥 reuse your solver


import { getOrGenerateQuestions } from "../services/aiQuestionServices.js";
import { checkLimit } from "../services/limitServices.js";


import { generateMixedQuiz } from "../services/aiMixedGenerator.js";
// import { checkLimit } from "../services/limitServices.js";

import { updateTopicPerformance, getWeakTopics } from "../services/performanceService.js";
// import TopicPerformance from "../models/TopicPerformance.js";

import { generateAdaptiveQuiz } from "../services/adaptiveQuizService.js";

import {
  calculateXP,
  calculateLevel,
  updateStreak
} from "../services/gamificationService.js";

export const getAIQuizMixed = async (req, res) => {
  try {
    const { limit = 10, username = "Guest" } = req.query;

    // 🔐 LIMIT CONTROL
    checkLimit(username);

    // 🤖 GENERATE EXAM QUESTIONS
    const questions = await generateMixedQuiz(limit);

    // 💾 CACHE INTO DATABASE
    await Question.insertMany(questions);

    // 🚫 HIDE ANSWERS FOR STUDENTS
    const safe = questions.map(q => ({
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    res.json(safe);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const submitAIQuiz = async (req, res) => {
  try {
    const { username = "Guest", topic, answers } = req.body;

    let score = 0;
    let results = [];

    for (const item of answers) {
      const { questionId, selected } = item;

      // 1. Get question from DB
      const q = await Question.findById(questionId);

      if (!q) continue;

      const isCorrect = q.correctAnswer === selected;

      // 2. Score logic
      if (isCorrect) score += 10;

      // 3. Build result
      results.push({
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
});

}

    // 4. Save progress (reuse your existing model)
    let user = await QuizProgress.findOne({ username, topic });

    if (!user) {
      user = await QuizProgress.create({ username, topic });
    }

    user.attempts += answers.length;
    user.correct += results.filter(r => r.isCorrect).length;
   
    // user.score += score;
    // 🎯 XP SYSTEM
    const earnedXP = calculateXP(results);
    user.xp += earnedXP;

    // 🧠 LEVEL SYSTEM
    user.level = calculateLevel(user.xp);

    // 🔥 STREAK SYSTEM
    updateStreak(user);

    // streak logic
    if (results.every(r => r.isCorrect)) {
      user.streak += 1;
    } else {
      user.streak = 0;
    }

    // 🧠 SAVE PERFORMANCE
    await updateTopicPerformance(username, results);

    // 🔍 GET WEAK TOPICS
    const weakTopics = await getWeakTopics(username);

    await user.save();

    // 5. Response
    res.json({
       totalQuestions: answers.length,
      // score,
      // correct: results.filter(r => r.isCorrect).length,
      // results
      score,
      xpEarned: earnedXP,
      totalXP: user.xp,
      level: user.level,
      streak: user.streak,
      results,
      weakTopics
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit AI quiz" });
  }
};


export const getAIQuiz = async (req, res) => {
  try {
    const {
      subject = "Physics",
      topic = "Newton's Laws",
      limit = 5,
      username = "Guest"
    } = req.query;

    // 🔐 1. Check limit
    checkLimit(username);

    // 🤖 2. Get questions (DB or AI)
    const questions = await getOrGenerateQuestions({
      subject,
      topic,
      limit: Number(limit)
    });

    // 🚫 3. Hide answers
    const safeQuestions = questions.map(q => ({
      id: q._id,
      question: q.question,
      options: q.options
    }));

    res.json(safeQuestions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



export const getAdaptiveQuiz = async (req, res) => {
  try {
    const { username = "Guest", limit = 10 } = req.query;

    // 🔐 check AI usage
    checkLimit(username);

    const questions = await generateAdaptiveQuiz({
      username,
      limit: Number(limit)
    });

    // 🚫 hide answers
    const safe = questions.map(q => ({
      id: q._id,
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    res.json(safe);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getUserAnalytics = async (req, res) => {
  try {
    const { username = "Guest" } = req.query;

    const data = await TopicPerformance.find({ username });

    const summary = data.map(t => ({
      subject: t.subject,
      topic: t.topic,
      attempts: t.attempts,
      correct: t.correct,
      accuracy: t.accuracy
    }));

    res.json(summary);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLeaderboardXP = async (req, res) => {
  try {
    const leaders = await QuizProgress.aggregate([
      {
        $group: {
          _id: "$username",
          totalXP: { $max: "$xp" },
          level: { $max: "$level" },
          streak: { $max: "$streak" },
          totalScore: { $sum: "$score" },
          totalAttempts: { $sum: "$attempts" },
          totalCorrect: { $sum: "$correct" }
        }
      },
      {
        $addFields: {
          accuracy: {
            $cond: [
              { $eq: ["$totalAttempts", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$totalCorrect", "$totalAttempts"] },
                  100
                ]
              }
            ]
          }
        }
      },
      {
        $sort: {
          totalXP: -1,
          level: -1,
          streak: -1
        }
      },
      {
        $limit: 20
      }
    ]);

    const formatted = leaders.map((u, index) => ({
      rank: index + 1,
      username: u._id,
      xp: u.totalXP,
      level: u.level,
      streak: u.streak,
      accuracy: Number(u.accuracy.toFixed(1))
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Leaderboard error" });
  }
};


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
    // 🔥 SOLUTION ENGINE (ALWAYS RUN)
    let solution = null;

    if (problem) {
      console.log("🧠 Solving problem:", problem);

      const solved = solveMathProblem(problem);

      console.log("🧠 Solver result:", solved);

      if (!solved.error) {
        solution = {
          steps: solved.steps || [],
          answer: solved.answer,
          formula: solved.formula || "",
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