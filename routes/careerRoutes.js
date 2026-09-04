import express from "express";
import { saveCareerProfile, getCareerProfile } from "../controllers/careerController.js";
import authUser from "../middleware/authUser.js";
import checkSubscription from "../middleware/checkSubscription.js";

const router = express.Router();

// Generating/regenerating a roadmap counts as one AI attempt against
// the same free-tier gate as everything else — reading an already-saved
// roadmap does not.
router.post("/profile", authUser, checkSubscription, saveCareerProfile);
router.get("/profile", authUser, getCareerProfile);

export default router;
