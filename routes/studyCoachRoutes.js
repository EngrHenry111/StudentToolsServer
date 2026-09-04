import express from "express";
import { getStudyCoachOverview } from "../controllers/studyCoachController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();

router.get("/overview", authUser, getStudyCoachOverview);

export default router;
