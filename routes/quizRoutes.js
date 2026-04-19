import express from "express";
import { getQuizQuestion, submitQuizAnswer,
  getLeaderboard } from "../controllers/quizController.js";

const router = express.Router();

router.get("/question", getQuizQuestion);

router.post("/submit", submitQuizAnswer);

// 🔥 ADD THIS
router.get("/leaderboard", getLeaderboard);


export default router;