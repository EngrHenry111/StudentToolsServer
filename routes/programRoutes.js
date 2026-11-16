import express from "express";
import {
  getActiveProgram,
  getProgram,
  applyToProgram,
  adminListPrograms,
  adminCreateProgram,
  adminGetProgram,
  adminUpdateProgram,
  adminListApplications,
  adminDecideApplications,
  adminResendAcceptedEmail
} from "../controllers/programController.js";
import optionalAuthUser from "../middleware/optionalAuthUser.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ---- Admin (declared first so "/admin/..." never matches "/:slug") ----
router.get("/admin/all", adminAuth, adminListPrograms);
router.post("/admin", adminAuth, adminCreateProgram);
router.get("/admin/:id", adminAuth, adminGetProgram);
router.put("/admin/:id", adminAuth, adminUpdateProgram);
router.get("/admin/:id/applications", adminAuth, adminListApplications);
router.post("/admin/:id/applications/decide", adminAuth, adminDecideApplications);
router.post("/admin/:id/applications/:appId/resend", adminAuth, adminResendAcceptedEmail);

// ---- Public ----
router.get("/active", getActiveProgram);
router.get("/:slug", optionalAuthUser, getProgram);
router.post("/:slug/apply", optionalAuthUser, applyToProgram);

export default router;
