import express from "express";
import { getTodaysMissions } from "../controllers/missionsController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

router.get("/today", authUser, getTodaysMissions);

export default router;
