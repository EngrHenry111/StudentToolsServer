import express from "express";
import {
 createTutorial,
 getTutorials,
 getAdminTutorials,
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

// Admin-only: full listing including drafts.
router.get("/admin/list", adminAuth, getAdminTutorials);

router.get("/search", searchTutorials);
router.get("/suggest",searchSuggestions);


router.get("/related", getRelatedTutorials);   // must be before slug

router.get("/trending", getTrendingTutorials);

// Static path segments must be registered before the "/:slug" catch-all,
// otherwise "/categories", "/topics/x" and "/subtopics" are swallowed by it
// and resolve as (missing) tutorial slugs.
router.get("/categories", getCategories);

router.get("/topics/:category", getTopicsByCategory);

router.get("/subtopics", getSubtopics);

// Admin-only: load a single tutorial by id (drafts included) for the
// edit / preview screens. Public reads go through "/:slug" below.
router.get("/preview/:id", adminAuth, getTutorialById);

router.get("/:slug", getTutorialBySlug);

router.put("/:id", adminAuth, updateTutorial);
router.delete("/:id", adminAuth, deleteTutorial);
export default router;