import express from "express";
import { solveMath } from "../controllers/mathController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import MathHistory from "../models/MathHistory.js";


const router = express.Router();

// Public
router.post("/solve", solveMath);

// Admin (future expansion)
router.post("/admin/add-topic", authMiddleware, (req, res) => {
  res.json({ message: "Add topic (future feature)" });
});


// 🔥 GET HISTORY
router.get("/history", async (req, res, next) => {
  try {
    const history = await MathHistory
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);

  } catch (error) {
    next(error);
  }
});

export default router;