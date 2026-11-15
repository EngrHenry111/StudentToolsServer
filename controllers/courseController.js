import TechCourse from "../models/TechCourse.js";
import CourseLesson from "../models/CourseLesson.js";
import CourseApproval from "../models/CourseApproval.js";
import CourseOrder from "../models/CourseOrder.js";
import LessonProgress from "../models/LessonProgress.js";
import {
  getCourseAccess,
  initializeCoursePayment
} from "../services/courseAccessService.js";
import { createSignedEmbedUrl } from "../services/bunnyStreamService.js";
import { claimWatchSlot, heartbeatWatchSlot, releaseWatchSlot } from "../services/watchSessionService.js";

// POST /api/courses/watch/heartbeat   (authUser)  body: { deviceId }
export const watchHeartbeat = async (req, res) => {
  try {
    const r = await heartbeatWatchSlot({ userId: req.user._id, deviceId: String(req.body?.deviceId || "") });
    if (!r.ok) return res.status(r.status).json(r.body);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses/watch/release   (authUser)  body: { deviceId }
export const watchRelease = async (req, res) => {
  try {
    await releaseWatchSlot({ userId: req.user._id, deviceId: String(req.body?.deviceId || "") });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

// Public fields only — never bunnyVideoId (that plus a token key is a video).
const publicLesson = (l) => ({
  _id: l._id,
  title: l.title,
  description: l.description,
  module: l.module,
  order: l.order,
  durationSeconds: l.durationSeconds,
  isFreePreview: l.isFreePreview,
  isReady: l.videoStatus === "ready"
});

const publicCourse = (c) => ({
  _id: c._id,
  title: c.title,
  slug: c.slug,
  tagline: c.tagline,
  description: c.description,
  coverImageUrl: c.coverImageUrl,
  instructor: c.instructor,
  price: c.price / 100 // naira
});

const findPublishedCourse = (slug) => TechCourse.findOne({ slug: String(slug).toLowerCase(), isPublished: true });

// GET /api/courses
export const listCourses = async (req, res) => {
  try {
    const courses = await TechCourse.find({ isPublished: true }).sort({ createdAt: -1 });
    const counts = await CourseLesson.aggregate([
      { $match: { course: { $in: courses.map((c) => c._id) }, isPublished: true } },
      { $group: { _id: "$course", lessons: { $sum: 1 }, seconds: { $sum: "$durationSeconds" } } }
    ]);
    const byId = Object.fromEntries(counts.map((c) => [String(c._id), c]));

    res.json(courses.map((c) => ({
      ...publicCourse(c),
      lessonCount: byId[c._id]?.lessons || 0,
      totalSeconds: byId[c._id]?.seconds || 0
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:slug   (optionalAuthUser)
export const getCourse = async (req, res) => {
  try {
    const course = await findPublishedCourse(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lessons = await CourseLesson.find({ course: course._id, isPublished: true }).sort({ order: 1, createdAt: 1 });
    const access = await getCourseAccess(req.user, course);

    let completedLessonIds = [];
    if (req.user && access.hasAccess) {
      const done = await LessonProgress.find({ user: req.user._id, course: course._id }).select("lesson");
      completedLessonIds = done.map((d) => String(d.lesson));
    }

    res.json({
      course: publicCourse(course),
      lessons: lessons.map(publicLesson),
      access,
      completedLessonIds
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/:slug/lessons/:lessonId/play   (optionalAuthUser)
export const playLesson = async (req, res) => {
  try {
    const course = await findPublishedCourse(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = await CourseLesson.findOne({ _id: req.params.lessonId, course: course._id, isPublished: true });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (!lesson.isFreePreview) {
      const access = await getCourseAccess(req.user, course);
      if (!access.hasAccess) {
        return res.status(req.user ? 403 : 401).json({ message: "You don't have access to this lesson", access });
      }
    }

    if (lesson.videoStatus !== "ready" || !lesson.bunnyVideoId) {
      return res.status(409).json({ message: "This video is still processing. Check back shortly.", code: "PROCESSING" });
    }

    // One device at a time for enrolled content (free previews are open).
    if (!lesson.isFreePreview) {
      const slot = await claimWatchSlot({
        userId: req.user._id,
        deviceId: String(req.query.device || ""),
        courseId: course._id,
        lessonId: lesson._id,
        takeover: req.query.takeover === "1"
      });
      if (!slot.ok) return res.status(slot.status).json(slot.body);
    }

    res.json(createSignedEmbedUrl(lesson.bunnyVideoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses/:slug/claim   (authUser)  body: { token }
// Proves the logged-in account owns an approved email: the token only
// ever went to that inbox, and it must match the account's email.
export const claimApproval = async (req, res) => {
  try {
    const course = await findPublishedCourse(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const token = String(req.body?.token || "");
    const approval = token && await CourseApproval.findOne({ course: course._id, claimToken: token });
    if (!approval) return res.status(400).json({ message: "This access link is invalid or has been replaced." });

    if (approval.email !== req.user.email.toLowerCase()) {
      return res.status(403).json({
        message: `This link is for ${approval.email}. Log in with that email address to activate access.`,
        expectedEmail: approval.email
      });
    }

    if (approval.claimedBy && !approval.claimedBy.equals(req.user._id)) {
      return res.status(409).json({ message: "This access has already been activated on another account." });
    }

    approval.claimedBy = req.user._id;
    approval.claimedAt = approval.claimedAt || new Date();
    await approval.save();

    // They clicked a link sent to this inbox — the email is verified.
    if (!req.user.isVerified) {
      req.user.isVerified = true;
      await req.user.save();
    }

    res.json({ message: "Access activated", access: { hasAccess: true, type: "approved", needsClaim: false } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/courses/:slug/purchase   (authUser)
export const purchaseCourse = async (req, res) => {
  try {
    const course = await findPublishedCourse(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ message: "This course isn't available for purchase yet." });
    }

    const access = await getCourseAccess(req.user, course);
    if (access.hasAccess) return res.status(400).json({ message: "You already have access to this course." });

    const reference = `crs_${course._id}_${req.user._id}_${Date.now()}`;

    // Price is read from the DB here — never from the client.
    await CourseOrder.create({
      course: course._id,
      user: req.user._id,
      amount: course.price,
      paystackReference: reference
    });

    const tx = await initializeCoursePayment({
      email: req.user.email,
      amountKobo: course.price,
      reference,
      callbackUrl: `${CLIENT_URL}/courses/${course.slug}?paid=1`,
      metadata: { type: "course", courseId: String(course._id), userId: String(req.user._id) }
    });

    res.json({ authorization_url: tx.authorization_url });
  } catch (err) {
    console.error("COURSE PURCHASE ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

// POST /api/courses/:slug/lessons/:lessonId/complete   (authUser)
// body: { completed: boolean }  — toggles the tick in the lesson list.
export const setLessonComplete = async (req, res) => {
  try {
    const course = await findPublishedCourse(req.params.slug);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = await CourseLesson.findOne({ _id: req.params.lessonId, course: course._id });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const access = await getCourseAccess(req.user, course);
    if (!access.hasAccess) return res.status(403).json({ message: "No access" });

    if (req.body?.completed === false) {
      await LessonProgress.deleteOne({ user: req.user._id, lesson: lesson._id });
    } else {
      await LessonProgress.updateOne(
        { user: req.user._id, lesson: lesson._id },
        { $setOnInsert: { course: course._id, completedAt: new Date() } },
        { upsert: true }
      );
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/courses/me/enrolled   (authUser)
export const getMyCourses = async (req, res) => {
  try {
    const courses = await TechCourse.find({ isPublished: true });
    const mine = [];
    for (const c of courses) {
      const access = await getCourseAccess(req.user, c);
      if (access.hasAccess || access.needsClaim) {
        const [total, done] = await Promise.all([
          CourseLesson.countDocuments({ course: c._id, isPublished: true }),
          LessonProgress.countDocuments({ user: req.user._id, course: c._id })
        ]);
        mine.push({ ...publicCourse(c), access, lessonCount: total, completedCount: done });
      }
    }
    res.json(mine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
