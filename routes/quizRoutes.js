import express from "express";
import {
  getQuizQuestion,
  submitQuizAnswer,
  getLeaderboard,
  getAIQuiz,
  submitAIQuiz,
  getAIQuizMixed,
  getUserAnalytics,
  getAdaptiveQuiz,
  getLeaderboardXP
} from "../controllers/quizController.js";
import checkSubscription from "../middleware/checkSubscription.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

// =========================
// FREE PRACTICE QUIZ (no login required)
// =========================
router.get("/question", getQuizQuestion);
router.post("/submit", submitQuizAnswer);
router.get("/leaderboard", getLeaderboard);

// =========================
// PRO QUIZ (authenticated)
// =========================
router.get("/ai-quiz", authUser, checkSubscription, getAIQuiz);
router.get("/adaptive", authUser, checkSubscription, getAdaptiveQuiz);
router.get("/ai-mixed", authUser, checkSubscription, getAIQuizMixed);
router.post("/ai-quiz/submit", authUser, submitAIQuiz);
router.get("/analytics", authUser, getUserAnalytics);
router.get("/leaderboard-xp", authUser, getLeaderboardXP);

export default router;
