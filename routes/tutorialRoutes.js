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

const router = express.Router();

// 🔒 SECURITY: creating, editing, and deleting tutorials must require an
// authenticated admin. These were previously open to anyone on the
// internet (create/update had no auth at all; delete had errorHandler
// mistakenly placed in the middleware chain, which isn't how Express
// error-handling middleware is meant to be used and made the auth check
// unreliable).
router.post("/", adminAuth, createTutorial);
router.get("/", getTutorials);

router.get("/search", searchTutorials);
router.get("/suggest",searchSuggestions);


router.get("/related", getRelatedTutorials);   // must be before slug

router.get("/trending", getTrendingTutorials);

router.get("/:slug", getTutorialBySlug);

router.get("/categories", getCategories);

router.get("/topics/:category", getTopicsByCategory);

router.put("/:id", adminAuth, updateTutorial);
router.delete("/:id", adminAuth, deleteTutorial);

router.get("/preview/:id", getTutorialById);

router.get("/subtopics", getSubtopics);
export default router;