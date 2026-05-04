import express from "express";
import {
 createTutorial,
 getTutorials,
 searchTutorials,
 getTutorialBySlug, 
 getRelatedTutorials,
 getTrendingTutorials,
 searchSuggestions,
 getCategories,
 getTopicsByCategory,
 updateTutorial,
 deleteTutorial,
 getTutorialById,
 getSubtopics
} from "../controllers/tutorialController.js";

import adminAuth from "../middleware/adminAuth.js"
import { errorHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/", createTutorial);
router.get("/", getTutorials);

router.get("/search", searchTutorials);
router.get("/suggest",searchSuggestions);


router.get("/related", getRelatedTutorials);   // must be before slug

router.get("/trending", getTrendingTutorials);

router.get("/:slug", getTutorialBySlug);

router.get("/categories", getCategories);

router.get("/topics/:category", getTopicsByCategory);

// ADD THIS

router.put("/:id", updateTutorial);
router.delete("/:id", errorHandler, adminAuth, deleteTutorial); // if not already

router.get("/preview/:id", getTutorialById);

router.get("/subtopics", getSubtopics);
export default router;