import express from "express";
import { getQuizQuestion, submitQuizAnswer,
  getLeaderboard, getAIQuiz, submitAIQuiz,
   getAIQuizMixed, getUserAnalytics, getAdaptiveQuiz,
   getLeaderboardXP
   } from "../controllers/quizController.js";

const router = express.Router();

import authUser from "../middleware/authUser.js";

// protect routes
router.get("/adaptive", authUser, getAdaptiveQuiz);
router.post("/ai-quiz/submit", authUser, submitAIQuiz);
router.get("/leaderboard-xp", authUser, getLeaderboardXP);
router.get("/question", getQuizQuestion);

router.post("/submit", submitQuizAnswer);

// 🔥 ADD THIS
router.get("/leaderboard", getLeaderboard);

router.get("/ai-quiz", getAIQuiz);

router.post("/ai-quiz/submit", submitAIQuiz);

router.get("/ai-mixed", getAIQuizMixed);

router.get("/analytics", getUserAnalytics);

router.get("/adaptive", getAdaptiveQuiz);

router.get("/leaderboard-xp", getLeaderboardXP);





export default router;