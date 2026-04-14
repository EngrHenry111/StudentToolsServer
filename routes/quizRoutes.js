import express from "express";
import { getQuizQuestion } from "../controllers/quizController.js";

const router = express.Router();

router.get("/question", getQuizQuestion);

export default router;