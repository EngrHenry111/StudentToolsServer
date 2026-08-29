import express from "express";
import { adminLogin, getAdminStats, addCuratedQuestion, listCuratedQuestions, deleteCuratedQuestion, getFullDashboardStats, findUserByEmail, toggleUserPro } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", adminAuth, getAdminStats);
router.get("/full-stats", adminAuth, getFullDashboardStats);

router.post("/curated-questions", adminAuth, addCuratedQuestion);
router.get("/curated-questions", adminAuth, listCuratedQuestions);
router.delete("/curated-questions/:id", adminAuth, deleteCuratedQuestion);

router.get("/users/find", adminAuth, findUserByEmail);
router.post("/users/:id/toggle-pro", adminAuth, toggleUserPro);

export default router;