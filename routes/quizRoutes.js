import express from "express";
import { getQuizQuestion, submitQuizAnswer,
  getLeaderboard, getAIQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.get("/question", getQuizQuestion);

router.post("/submit", submitQuizAnswer);

// 🔥 ADD THIS
router.get("/leaderboard", getLeaderboard);

router.get("/ai-quiz", getAIQuiz);


export default router;