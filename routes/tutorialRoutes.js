import express from "express";
import {
 createTutorial,
 getTutorials,
 searchTutorials,
 getTutorialBySlug, 
 getRelatedTutorials
} from "../controllers/tutorialController.js";

const router = express.Router();

router.post("/", createTutorial);
router.get("/", getTutorials);

router.get("/search", searchTutorials);
router.get("/:slug", getTutorialBySlug);

router.get("/related", getRelatedTutorials);

export default router;