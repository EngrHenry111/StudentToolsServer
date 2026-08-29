import express from "express";
import {
  listInstitutions,
  saveCampusProfile,
  adminCreateInstitution,
  adminListInstitutions,
  adminUpdateInstitution,
  adminDeleteInstitution
} from "../controllers/institutionController.js";
import authUser from "../middleware/authUser.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public — used by the onboarding dropdown
router.get("/", listInstitutions);

// Student — save their own campus profile
router.post("/campus-profile", authUser, saveCampusProfile);

// Admin — manage institutions
router.get("/admin/all", adminAuth, adminListInstitutions);
router.post("/admin", adminAuth, adminCreateInstitution);
router.put("/admin/:id", adminAuth, adminUpdateInstitution);
router.delete("/admin/:id", adminAuth, adminDeleteInstitution);

export default router;
