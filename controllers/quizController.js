import QuizProgress from "../models/QuizProgress.js";
import TopicPerformance from "../models/topicPerformance.js";
import Question from "../models/questionModel.js";

import { generateQuestion } from "../services/quetionFactory.js";
import { solveMathProblem } from "../services/index.js";

import { getOrGenerateQuestions } from "../services/aiQuestionServices.js";
import { checkLimit } from "../services/limitServices.js";
import { generateMixedQuiz } from "../services/aiMixedGenerator.js";
import { updateTopicPerformance, getWeakTopics } from "../services/performanceService.js";
import { generateAdaptiveQuiz } from "../services/adaptiveQuizService.js";

import {
  calculateXP,
  calculateLevel,
  updateStreak
} from "../services/gamificationService.js";

import { generateQuizSummary } from "../services/quizSummaryGenerator.js";

// Sentinel topic value used for a user's single "overall" Pro progress
// document (aggregate XP/level/streak), so it never collides with the
// per-topic documents used by the free practice quiz.
const OVERALL_TOPIC = "__overall__";

// Builds a stable identity object from the authenticated user attached
// by the authUser middleware. Every Pro quiz route uses this instead of
// trusting a username sent in the request body/query.
const identityFromReq = (req) => ({
  userId: req.user._id,
  username: req.user.username
});


// =====================================================
// MIXED QUIZ (multi-subject, AI-backed)
// =====================================================
export const getAIQuizMixed = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const identity = identityFromReq(req);

    checkLimit(String(identity.userId));

    const questions = await generateMixedQuiz(Number(limit));

    const safe = questions
      .filter(Boolean)
      .map(q => ({
        id: q._id,
        subject: q.subject,
        topic: q.topic,
        question: q.question,
        options: q.options
      }));

    res.json(safe);

  } catch (err) {
    console.error("MIXED QUIZ ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// =====================================================
// SUBMIT AI / MIXED / ADAPTIVE QUIZ (authenticated)
// =====================================================
export const submitAIQuiz = async (req, res) => {
  try {
    const identity = identityFromReq(req);
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "No answers submitted" });
    }

    let score = 0;
    const results = [];

    for (const item of answers) {
      const { questionId, selected } = item;

      const q = await Question.findById(questionId);
      if (!q) continue;

      const isCorrect = q.correctAnswer === selected;
      if (isCorrect) score += 10;

      results.push({
        questionId: q._id,
        subject: q.subject,
        topic: q.topic,
        question: q.question,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        source: q.source,
        conceptTag: q.conceptTag
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "None of the submitted questions could be found" });
    }

    let progress = await QuizProgress.findOne({
      userId: identity.userId,
      topic: OVERALL_TOPIC
    });

    if (!progress) {
      progress = await QuizProgress.create({
        userId: identity.userId,
        username: identity.username,
        topic: OVERALL_TOPIC
      });
    }

    progress.attempts += results.length;
    progress.correct += results.filter(r => r.isCorrect).length;
    progress.score += score;

    const earnedXP = calculateXP(results);
    progress.xp += earnedXP;
    progress.level = calculateLevel(progress.xp);

    updateStreak(progress);

    await progress.save();

    await updateTopicPerformance(identity, results);
    const weakTopics = await getWeakTopics(identity);

    // If any submitted questions came from an uploaded material (the
    // Material-Based Quiz Generator), generate a real synthesized study
    // recap — not just the raw right/wrong list below, an actual "here's
    // what to review" summary. Skipped entirely for ordinary subject
    // quizzes, where it wouldn't add much beyond the existing weakTopics.
    const hasMaterialQuestions = results.some((r) => r.source === "material");
    const aiSummary = hasMaterialQuestions
      ? await generateQuizSummary(results)
      : null;

    res.json({
      totalQuestions: answers.length,
      score,
      xpEarned: earnedXP,
      totalXP: progress.xp,
      level: progress.level,
      streak: progress.streak,
      results,
      weakTopics,
      aiSummary
    });

  } catch (err) {
    console.error("SUBMIT AI QUIZ ERROR:", err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};


// =====================================================
// PAST QUESTIONS (curated, WAEC/JAMB-style bank)
// =====================================================
export const getPastQuestions = async (req, res) => {
  try {
    const { subject, topic, examBody, limit = 10 } = req.query;

    const query = { source: "curated" };
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    if (examBody) query.examBody = examBody;

    // Random sample so repeated attempts don't always show the same order
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: Number(limit) } }
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        message: "No curated questions found for that selection yet — more are being added regularly."
      });
    }

    const safe = questions.map(q => ({
      id: q._id,
      subject: q.subject,
      topic: q.topic,
      examBody: q.examBody,
      question: q.question,
      options: q.options
    }));

    res.json(safe);

  } catch (err) {
    console.error("PAST QUESTIONS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// =====================================================
// AI QUIZ (single subject/topic, AI-generated, cached in DB)
// =====================================================
export const getAIQuiz = async (req, res) => {
  try {
    const { subject, topic, limit = 5 } = req.query;

    if (!subject || !topic) {
      return res.status(400).json({ message: "Subject and topic are required" });
    }

    const cleanSubject = subject.trim().toLowerCase();
    const cleanTopic = topic.trim();
    const cleanLimit = parseInt(limit) || 5;

    if (cleanLimit > 20) {
      return res.status(400).json({ message: "Maximum limit is 20" });
    }

    const questions = await getOrGenerateQuestions({
      subject: cleanSubject,
      topic: cleanTopic,
      limit: cleanLimit
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: "No quiz questions found" });
    }

    const safe = questions.map(q => ({
      id: q._id,
      _id: q._id,
      subject: q.subject,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    res.status(200).json(safe);

  } catch (err) {
    console.error("AI QUIZ ERROR:", err.message);
    res.status(500).json({
      message: "AI quiz generation failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
};


// =====================================================
// ADAPTIVE QUIZ (weighted toward the user's weak topics)
// =====================================================
export const getAdaptiveQuiz = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const identity = identityFromReq(req);

    checkLimit(String(identity.userId));

    const questions = await generateAdaptiveQuiz({
      identity,
      limit: Number(limit)
    });

    const safe = questions
      .filter(Boolean)
      .map(q => ({
        id: q._id,
        subject: q.subject,
        topic: q.topic,
        question: q.question,
        options: q.options
      }));

    res.json(safe);

  } catch (err) {
    console.error("ADAPTIVE QUIZ ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// =====================================================
// USER ANALYTICS (per-topic performance for the logged-in user)
// =====================================================
export const getUserAnalytics = async (req, res) => {
  try {
    const identity = identityFromReq(req);

    const data = await TopicPerformance.find({ userId: identity.userId });

    const overall = await QuizProgress.findOne({
      userId: identity.userId,
      topic: OVERALL_TOPIC
    });

    const summary = data.map(t => ({
      subject: t.subject,
      topic: t.topic,
      attempts: t.attempts,
      correct: t.correct,
      accuracy: t.accuracy
    }));

    res.json({
      topics: summary,
      overall: overall
        ? {
            xp: overall.xp,
            level: overall.level,
            streak: overall.streak,
            attempts: overall.attempts,
            correct: overall.correct,
            score: overall.score
          }
        : { xp: 0, level: 1, streak: 0, attempts: 0, correct: 0, score: 0 }
    });

  } catch (err) {
    console.error("ANALYTICS ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// =====================================================
// XP LEADERBOARD (Pro)
// =====================================================
export const getLeaderboardXP = async (req, res) => {
  try {
    const leaders = await QuizProgress.aggregate([
      { $match: { topic: OVERALL_TOPIC } },
      {
        $group: {
          _id: "$userId",
          username: { $first: "$username" },
          totalXP: { $max: "$xp" },
          level: { $max: "$level" },
          streak: { $max: "$streak" },
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
              { $multiply: [{ $divide: ["$totalCorrect", "$totalAttempts"] }, 100] }
            ]
          }
        }
      },
      { $sort: { totalXP: -1, level: -1, streak: -1 } },
      { $limit: 20 }
    ]);

    const formatted = leaders.map((u, index) => ({
      rank: index + 1,
      username: u.username,
      xp: u.totalXP,
      level: u.level,
      streak: u.streak,
      accuracy: Number((u.accuracy || 0).toFixed(1))
    }));

    res.json(formatted);

  } catch (err) {
    console.error("XP LEADERBOARD ERROR:", err);
    res.status(500).json({ message: "Leaderboard error" });
  }
};


// =====================================================
// FREE PRACTICE QUIZ (no login required — unchanged behaviour)
// =====================================================

export const getQuizQuestion = async (req, res) => {
  try {
    const { topic = "percentage", username = "Guest", difficulty: requestedDifficulty } = req.query;

    let user = await QuizProgress.findOne({ username, topic });

    // Let the player's own dropdown choice win if they picked one —
    // previously this was silently ignored and difficulty was always
    // computed from streak, which made the difficulty selector do
    // nothing at all from the user's point of view.
    const validDifficulties = ["easy", "medium", "hard"];
    let difficulty;

    if (validDifficulties.includes(requestedDifficulty)) {
      difficulty = requestedDifficulty;
    } else {
      // fallback: adaptive difficulty based on streak
      difficulty = "easy";
      if (user) {
        if (user.streak >= 5) difficulty = "hard";
        else if (user.streak >= 2) difficulty = "medium";
      }
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

    let solution = null;

    if (problem) {
      const solved = solveMathProblem(problem);

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
      solution,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Submit failed" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaders = await QuizProgress.aggregate([
      { $match: { topic: { $ne: OVERALL_TOPIC } } },
      {
        $group: {
          _id: "$username",
          totalScore: { $sum: "$score" },
          totalAttempts: { $sum: "$attempts" },
          totalCorrect: { $sum: "$correct" },
          streak: { $max: "$streak" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
    ]);

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
