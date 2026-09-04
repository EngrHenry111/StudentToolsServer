import express from "express";
import {
  askCourseTutor,
  listConversations,
  getConversation,
  deleteConversation
} from "../controllers/courseTutorController.js";
import authUser from "../middleware/authUser.js";
import checkSubscription from "../middleware/checkSubscription.js";

const router = express.Router();

// Same free-tier-attempts gating as the other AI features — each
// question consumes one attempt for free users, unlimited for Pro.
router.post("/ask", authUser, checkSubscription, askCourseTutor);
router.get("/conversations", authUser, listConversations);
router.get("/conversations/:id", authUser, getConversation);
router.delete("/conversations/:id", authUser, deleteConversation);

export default router;
