import express from "express";
import { adminLogin, getAdminStats, addCuratedQuestion, listCuratedQuestions, deleteCuratedQuestion, getFullDashboardStats } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", adminAuth, getAdminStats); // 🔒 was completely unprotected
router.get("/full-stats", adminAuth, getFullDashboardStats);

// Curated (WAEC/JAMB-style) question bank management
router.post("/curated-questions", adminAuth, addCuratedQuestion);
router.get("/curated-questions", adminAuth, listCuratedQuestions);
router.delete("/curated-questions/:id", adminAuth, deleteCuratedQuestion);


export default router;