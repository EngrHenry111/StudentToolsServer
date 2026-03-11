import express from "express";
import {
 createTutorial,
 getTutorials,
 searchTutorials,
 getTutorialBySlug
} from "../controllers/tutorialController.js";

const router = express.Router();

router.post("/", createTutorial);
router.get("/", getTutorials);
router.get("/search", searchTutorials);
router.get("/:slug", getTutorialBySlug);

export default router;