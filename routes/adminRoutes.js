import express from "express";
import { adminLogin, getAdminStats, addCuratedQuestion, listCuratedQuestions, deleteCuratedQuestion } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", adminAuth, getAdminStats); // 🔒 was completely unprotected

// Curated (WAEC/JAMB-style) question bank management
router.post("/curated-questions", adminAuth, addCuratedQuestion);
router.get("/curated-questions", adminAuth, listCuratedQuestions);
router.delete("/curated-questions/:id", adminAuth, deleteCuratedQuestion);


export default router;
