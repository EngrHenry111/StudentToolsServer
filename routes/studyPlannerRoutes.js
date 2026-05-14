import express from "express";

import {
 createPlan,
 getPlans,
 deletePlan
} from "../controllers/studyPlannerController.js";

const router = express.Router();

router.post("/", createPlan);

router.get("/", getPlans);

router.delete("/:id", deletePlan);

export default router;