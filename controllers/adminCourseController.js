import slugify from "slugify";
import TechCourse from "../models/TechCourse.js";
import CourseLesson from "../models/CourseLesson.js";
import CourseApproval from "../models/CourseApproval.js";
import CourseOrder from "../models/CourseOrder.js";
import {
  isBunnyConfigured,
  createVideo,
  getVideo,
  deleteVideo,
  mapBunnyStatus,
  createTusUploadCredentials,
  createSignedEmbedUrl
} from "../services/bunnyStreamService.js";
import { newClaimToken, sendApprovalEmail } from "../services/courseAccessService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COURSE_FIELDS = ["title", "tagline", "description", "coverImageUrl", "instructor", "isPublished"];
const LESSON_FIELDS = ["title", "description", "module", "order", "isFreePreview", "isPublished"];

const pick = (body, fields) =>
  Object.fromEntries(fields.filter((f) => body?.[f] !== undefined).map((f) => [f, body[f]]));

// Admin sends naira; stored as kobo.
const nairaToKobo = (n) => Math.max(0, Math.round(Number(n) * 100) || 0);

const withNaira = (c) => ({ ...c.toObject(), price: c.price / 100 });

// ---------------------------------------------------------------- courses

export const adminListCourses = async (req, res) => {
  try {
    const courses = await TechCourse.find().sort({ createdAt: -1 });
    const ids = courses.map((c) => c._id);
    const [lessons, approvals, paid] = await Promise.all([
      CourseLesson.aggregate([{ $match: { course: { $in: ids } } }, { $group: { _id: "$course", n: { $sum: 1 } } }]),
      CourseApproval.aggregate([{ $match: { course: { $in: ids } } }, { $group: { _id: "$course", n: { $sum: 1 } } }]),
      CourseOrder.aggregate([
        { $match: { course: { $in: ids }, status: "completed" } },
        { $group: { _id: "$course", n: { $sum: 1 }, revenue: { $sum: "$amount" } } }
      ])
    ]);
    const m = (arr) => Object.fromEntries(arr.map((x) => [String(x._id), x]));
    const L = m(lessons), A = m(approvals), P = m(paid);

    res.json({
      bunnyConfigured: isBunnyConfigured(),
      courses: courses.map((c) => ({
        ...withNaira(c),
        lessonCount: L[c._id]?.n || 0,
        approvedCount: A[c._id]?.n || 0,
        paidCount: P[c._id]?.n || 0,
        revenue: (P[c._id]?.revenue || 0) / 100
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminGetCourse = async (req, res) => {
  try {
    const course = await TechCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ ...withNaira(course), bunnyConfigured: isBunnyConfigured() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminCreateCourse = async (req, res) => {
  try {
    const data = pick(req.body, COURSE_FIELDS);
    if (!data.title?.trim()) return res.status(400).json({ message: "Title is required" });

    const slug = slugify(req.body.slug || data.title, { lower: true, strict: true });
    if (await TechCourse.exists({ slug })) {
      return res.status(400).json({ message: `A course with the URL "${slug}" already exists` });
    }

    const course = await TechCourse.create({ ...data, slug, price: nairaToKobo(req.body.price) });
    res.status(201).json(withNaira(course));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateCourse = async (req, res) => {
  try {
    const update = pick(req.body, COURSE_FIELDS);
    if (req.body.price !== undefined) update.price = nairaToKobo(req.body.price);
    if (req.body.slug) {
      const slug = slugify(req.body.slug, { lower: true, strict: true });
      if (await TechCourse.exists({ slug, _id: { $ne: req.params.id } })) {
        return res.status(400).json({ message: `A course with the URL "${slug}" already exists` });
      }
      update.slug = slug;
    }

    const course = await TechCourse.findByIdAndUpdate(req.params.id, update, { returnDocument: "after", runValidators: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(withNaira(course));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------------- lessons

// Pulls the latest encoding state from Bunny for lessons not yet final.
const syncLessonStatuses = async (lessons) => {
  if (!isBunnyConfigured()) return;
  await Promise.all(lessons
    .filter((l) => l.bunnyVideoId && l.videoStatus !== "ready")
    .slice(0, 20)
    .map(async (l) => {
      try {
        const v = await getVideo(l.bunnyVideoId);
        l.videoStatus = mapBunnyStatus(v.status);
        l.durationSeconds = Math.round(v.length || 0);
        await l.save();
      } catch (err) {
        console.error("BUNNY STATUS SYNC FAILED:", l._id, err.response?.status || err.message);
      }
    }));
};

export const adminListLessons = async (req, res) => {
  try {
    const lessons = await CourseLesson.find({ course: req.params.id }).sort({ order: 1, createdAt: 1 });
    await syncLessonStatuses(lessons);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Creates the lesson + an empty Bunny video, and returns TUS credentials
// so the admin's browser can upload the file directly to Bunny.
export const adminCreateLesson = async (req, res) => {
  try {
    if (!isBunnyConfigured()) {
      return res.status(500).json({ message: "Bunny Stream isn't configured on the server (BUNNY_STREAM_LIBRARY_ID / BUNNY_STREAM_API_KEY)." });
    }
    const course = await TechCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const data = pick(req.body, LESSON_FIELDS);
    if (!data.title?.trim()) return res.status(400).json({ message: "Lesson title is required" });

    if (data.order === undefined) {
      const last = await CourseLesson.findOne({ course: course._id }).sort({ order: -1 });
      data.order = (last?.order || 0) + 1;
    }

    const video = await createVideo(`${course.title} — ${data.title}`);
    const lesson = await CourseLesson.create({ ...data, course: course._id, bunnyVideoId: video.guid });

    res.status(201).json({ lesson, upload: createTusUploadCredentials(video.guid) });
  } catch (err) {
    console.error("CREATE LESSON ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

// Fresh upload credentials, e.g. to retry a failed upload or replace the video.
export const adminLessonUploadCredentials = async (req, res) => {
  try {
    const lesson = await CourseLesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (req.body?.replace && lesson.bunnyVideoId) {
      const old = lesson.bunnyVideoId;
      const course = await TechCourse.findById(lesson.course);
      const video = await createVideo(`${course?.title || "Course"} — ${lesson.title}`);
      lesson.bunnyVideoId = video.guid;
      lesson.videoStatus = "awaiting_upload";
      lesson.durationSeconds = 0;
      await lesson.save();
      deleteVideo(old).catch((e) => console.error("BUNNY DELETE OLD VIDEO FAILED:", e.message));
    }

    res.json({ lesson, upload: createTusUploadCredentials(lesson.bunnyVideoId) });
  } catch (err) {
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
};

export const adminUpdateLesson = async (req, res) => {
  try {
    const lesson = await CourseLesson.findByIdAndUpdate(
      req.params.lessonId,
      pick(req.body, LESSON_FIELDS),
      { returnDocument: "after", runValidators: true }
    );
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminDeleteLesson = async (req, res) => {
  try {
    const lesson = await CourseLesson.findByIdAndDelete(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    if (lesson.bunnyVideoId && isBunnyConfigured()) {
      deleteVideo(lesson.bunnyVideoId).catch((e) => console.error("BUNNY DELETE FAILED:", e.message));
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lets the admin preview any lesson (admins log in separately from users).
export const adminPlayLesson = async (req, res) => {
  try {
    const lesson = await CourseLesson.findById(req.params.lessonId);
    if (!lesson?.bunnyVideoId) return res.status(404).json({ message: "No video for this lesson" });
    res.json(createSignedEmbedUrl(lesson.bunnyVideoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------------- approved students

export const adminListApprovals = async (req, res) => {
  try {
    const approvals = await CourseApproval.find({ course: req.params.id })
      .sort({ createdAt: -1 })
      .populate("claimedBy", "username email")
      .select("-claimToken");
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// body: { emails: "a@x.com, b@y.com\nc@z.com", note?: "Cohort 1", sendEmail?: true }
export const adminAddApprovals = async (req, res) => {
  try {
    const course = await TechCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const raw = String(req.body?.emails || "").split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean);
    const unique = [...new Set(raw)];
    const valid = unique.filter((e) => EMAIL_RE.test(e));
    const invalid = unique.filter((e) => !EMAIL_RE.test(e));

    const existing = await CourseApproval.find({ course: course._id, email: { $in: valid } }).select("email");
    const existingSet = new Set(existing.map((a) => a.email));
    const toAdd = valid.filter((e) => !existingSet.has(e));

    const created = toAdd.length
      ? await CourseApproval.insertMany(toAdd.map((email) => ({
          course: course._id,
          email,
          note: req.body?.note || "",
          claimToken: newClaimToken()
        })), { ordered: false })
      : [];

    if (req.body?.sendEmail !== false) {
      created.forEach((a) => sendApprovalEmail(a, course));
    }

    res.json({ added: toAdd, alreadyApproved: [...existingSet], invalid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminResendApprovalEmail = async (req, res) => {
  try {
    const approval = await CourseApproval.findOne({ _id: req.params.approvalId, course: req.params.id });
    if (!approval) return res.status(404).json({ message: "Approval not found" });
    const course = await TechCourse.findById(req.params.id);
    await sendApprovalEmail(approval, course);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminRemoveApproval = async (req, res) => {
  try {
    const result = await CourseApproval.deleteOne({ _id: req.params.approvalId, course: req.params.id });
    if (!result.deletedCount) return res.status(404).json({ message: "Approval not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------------------------------------------------------- paid learners

export const adminListOrders = async (req, res) => {
  try {
    const orders = await CourseOrder.find({ course: req.params.id, status: { $ne: "failed" } })
      .sort({ createdAt: -1 })
      .limit(500)
      .populate("user", "username email");
    res.json(orders.map((o) => ({ ...o.toObject(), amount: o.amount / 100 })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/courses/admin/:id/live   body: { active?, url?, note? }
// Start (active: true) needs a link; ending keeps the link for reference.
export const adminSetLiveClass = async (req, res) => {
  try {
    const course = await TechCourse.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    const live = course.live || {};
    const { active, url, note } = req.body || {};

    if (url !== undefined) {
      const u = String(url).trim();
      if (u) {
        let parsed;
        try { parsed = new URL(u); } catch { parsed = null; }
        if (!parsed || parsed.protocol !== "https:") {
          return res.status(400).json({ message: "Paste the full meeting link, starting with https://" });
        }
      }
      live.url = u.slice(0, 500);
    }
    if (note !== undefined) live.note = String(note).trim().slice(0, 200);

    if (active === true) {
      if (!live.url) return res.status(400).json({ message: "Paste the meeting link before starting the live class" });
      if (!live.active) live.startedAt = new Date();
      live.active = true;
    } else if (active === false) {
      if (live.active) live.endedAt = new Date();
      live.active = false;
    }

    course.live = live;
    await course.save();
    res.json(withNaira(course));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
