import express from "express";
import {
  uploadMaterial,
  listMaterials,
  getMaterialQuiz,
  deleteMaterial
} from "../controllers/materialController.js";
import authUser from "../middleware/authUser.js";
import checkSubscription from "../middleware/checkSubscription.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Same free-tier-attempts gating as the subject-based AI quiz — a
// handful of free generations, then Pro required. Keeps this powerful
// (and AI-cost-bearing) feature from being spammed for free.
router.post("/upload", authUser, checkSubscription, upload.single("file"), uploadMaterial);

router.get("/", authUser, listMaterials);
router.get("/:id/quiz", authUser, getMaterialQuiz);
router.delete("/:id", authUser, deleteMaterial);

export default router;
