import express from "express";
import {
 createTutorial,
 getTutorials,
 searchTutorials,
 getTutorialBySlug, 
 getRelatedTutorials,
 getTrendingTutorials
} from "../controllers/tutorialController.js";

const router = express.Router();

router.post("/", createTutorial);
router.get("/", getTutorials);

router.get("/search", searchTutorials);

router.get("/related", getRelatedTutorials);   // must be before slug

router.get("/trending", getTrendingTutorials);

router.get("/:slug", getTutorialBySlug);
export default router;