import express from "express";
import {
  listCourses,
  getCourse,
  playLesson,
  claimApproval,
  purchaseCourse,
  setLessonComplete,
  getMyCourses,
  watchHeartbeat,
  watchRelease,
  getLiveClass
} from "../controllers/courseController.js";
import {
  adminListCourses,
  adminGetCourse,
  adminCreateCourse,
  adminUpdateCourse,
  adminListLessons,
  adminCreateLesson,
  adminLessonUploadCredentials,
  adminUpdateLesson,
  adminDeleteLesson,
  adminPlayLesson,
  adminListApprovals,
  adminAddApprovals,
  adminResendApprovalEmail,
  adminRemoveApproval,
  adminListOrders,
  adminSetLiveClass
} from "../controllers/adminCourseController.js";
import authUser from "../middleware/authUser.js";
import optionalAuthUser from "../middleware/optionalAuthUser.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ---- Admin (declared first so "/admin/..." never matches "/:slug") ----
router.get("/admin/all", adminAuth, adminListCourses);
router.post("/admin", adminAuth, adminCreateCourse);
router.get("/admin/:id", adminAuth, adminGetCourse);
router.put("/admin/:id", adminAuth, adminUpdateCourse);
router.put("/admin/:id/live", adminAuth, adminSetLiveClass);

router.get("/admin/:id/lessons", adminAuth, adminListLessons);
router.post("/admin/:id/lessons", adminAuth, adminCreateLesson);
router.put("/admin/lessons/:lessonId", adminAuth, adminUpdateLesson);
router.delete("/admin/lessons/:lessonId", adminAuth, adminDeleteLesson);
router.post("/admin/lessons/:lessonId/upload", adminAuth, adminLessonUploadCredentials);
router.get("/admin/lessons/:lessonId/play", adminAuth, adminPlayLesson);

router.get("/admin/:id/approvals", adminAuth, adminListApprovals);
router.post("/admin/:id/approvals", adminAuth, adminAddApprovals);
router.post("/admin/:id/approvals/:approvalId/resend", adminAuth, adminResendApprovalEmail);
router.delete("/admin/:id/approvals/:approvalId", adminAuth, adminRemoveApproval);

router.get("/admin/:id/orders", adminAuth, adminListOrders);

// ---- Students ----
router.get("/me/enrolled", authUser, getMyCourses);
router.post("/watch/heartbeat", authUser, watchHeartbeat);
router.post("/watch/release", authUser, watchRelease);

// ---- Public (course page renders for logged-out visitors too) ----
router.get("/", listCourses);
router.get("/:slug", optionalAuthUser, getCourse);
router.get("/:slug/lessons/:lessonId/play", optionalAuthUser, playLesson);

router.get("/:slug/live", authUser, getLiveClass);
router.post("/:slug/claim", authUser, claimApproval);
router.post("/:slug/purchase", authUser, purchaseCourse);
router.post("/:slug/lessons/:lessonId/complete", authUser, setLessonComplete);

export default router;
