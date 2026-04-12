import express from "express";
import { solveMath } from "../controllers/mathController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.post("/solve", solveMath);

// Admin (future expansion)
router.post("/admin/add-topic", authMiddleware, (req, res) => {
  res.json({ message: "Add topic (future feature)" });
});

export default router;