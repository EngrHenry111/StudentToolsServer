import express from "express";

import {
 saveSemester,
 getCumulativeCGPA
} from "../controllers/cgpaController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/semester",authMiddleware,saveSemester);

router.get("/cumulative",authMiddleware,getCumulativeCGPA);

export default router;