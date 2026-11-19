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
  adminResendAcceptedEmail,
  adminTestEmail,
  adminUploadLogo
} from "../controllers/programController.js";
import multer from "multer";
import optionalAuthUser from "../middleware/optionalAuthUser.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Sponsor logo: images only, up to 3 MB, kept in memory for Cloudinary.
const logoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.mimetype))
}).single("logo");
const logoUploadMw = (req, res, next) =>
  logoUpload(req, res, (err) => {
    if (!err) return next();
    const tooBig = err.code === "LIMIT_FILE_SIZE";
    res.status(400).json({ message: tooBig ? "Logo is too big. Use an image under 3 MB." : err.message });
  });

// ---- Admin (declared first so "/admin/..." never matches "/:slug") ----
router.get("/admin/all", adminAuth, adminListPrograms);
router.post("/admin/email-test", adminAuth, adminTestEmail);
router.post("/admin/logo", adminAuth, logoUploadMw, adminUploadLogo);
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
