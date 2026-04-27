import express from "express";

import { askTutorialAI } from "../controllers/aiController.js";
import { askAITutor } from "../controllers/aiTutorController.js";

const router = express.Router();

// AI tutor for general questions
router.post("/chat", askAITutor);

// AI for tutorial-specific questions
router.post("/tutorial", askTutorialAI);


export default router;