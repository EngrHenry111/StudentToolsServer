import express from "express";
import { askAITutor } from "../controllers/aiTutorController.js";

const router = express.Router();

router.post("/chat", askAITutor);

export default router;