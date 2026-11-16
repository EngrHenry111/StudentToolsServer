import bcrypt from "bcryptjs";
import crypto from "crypto";
import slugify from "slugify";
import Program from "../models/Program.js";
import ProgramApplication from "../models/ProgramApplication.js";
import TechCourse from "../models/TechCourse.js";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "./authController.js";
import { grantProgramAccess, revokeProgramAccess, sendAcceptedEmail } from "../services/programService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_FIELDS = "title slug sponsorName sponsorLogoUrl tagline description details eligibleLgas eligibleState batch status pausedMessage courses";

// "Uyo, Itu" → ["Uyo", "Itu"]
const lgaList = (s) => String(s || "").split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean);
const VISIBLE = ["open", "paused"];

const str = (v, max = 200) => String(v ?? "").trim().slice(0, max);

const publicCourses = (ids) =>
  TechCourse.find({ _id: { $in: ids || [] }, isPublished: true }).select("title slug tagline coverImageUrl");

const shapeProgram = async (p) => {
  const o = p.toObject ? p.toObject() : p;
  return { ...o, courses: await publicCourses(o.courses) };
};

// ================================================================ public

// The programme shown first on the home page and menu: the newest open one,
// otherwise the newest paused one (between batches). null when none.
export const getActiveProgram = async (req, res) => {
  try {
    const p =
      (await Program.findOne({ status: "open" }).sort({ updatedAt: -1 }).select("title slug sponsorName status batch")) ||
      (await Program.findOne({ status: "paused" }).sort({ updatedAt: -1 }).select("title slug sponsorName status batch"));
    res.set("Cache-Control", "public, max-age=60");
    res.json({ program: p || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProgram = async (req, res) => {
  try {
    const p = await Program.findOne({ slug: req.params.slug }).select(PUBLIC_FIELDS);
    if (!p || p.status === "draft") return res.status(404).json({ message: "Programme not found" });

    let myApplication = null;
    if (req.user) {
      const a = await ProgramApplication.findOne({ program: p._id, user: req.user._id })
        .sort({ createdAt: -1 })
        .select("status batch createdAt");
      if (a) myApplication = a;
    }
    // Personal (the visitor's own status) and changes when the admin acts:
    // never let a browser reuse an old copy on reload.
    res.set("Cache-Control", "no-store");
    res.json({ program: await shapeProgram(p), myApplication });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Usernames are unique; build one from the applicant's name.
const freeUsername = async (fullName) => {
  const base = slugify(fullName.split(/\s+/).slice(0, 2).join(" "), { lower: true, strict: true }).replace(/-/g, "").slice(0, 16) || "student";
  for (let i = 0; i < 6; i++) {
    const name = `${base}${crypto.randomInt(1000, 9999)}`;
    if (!(await User.exists({ username: name }))) return name;
  }
  return `${base}${Date.now()}`;
};

// Registration. A logged-in visitor applies with their account's email; a
// new visitor sets a password and the account is created here and logged
// in, so acceptance can switch course access on for that exact account.
export const applyToProgram = async (req, res) => {
  try {
    const body = req.body || {};

    // Bots fill every field, people never see this one.
    if (str(body.website)) return res.status(201).json({ ok: true });

    const program = await Program.findOne({ slug: req.params.slug });
    if (!program || program.status === "draft") return res.status(404).json({ message: "Programme not found" });
    if (program.status !== "open") {
      return res.status(403).json({ message: "Registration is closed at the moment.", code: "CLOSED" });
    }

    const fullName = str(body.fullName, 100);
    const phone = str(body.phone, 30);
    if (fullName.length < 3) return res.status(400).json({ message: "Please enter your full name" });
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) return res.status(400).json({ message: "Please enter a valid phone number" });

    // Indigenes of the sponsor's Local Government Area(s) only.
    const lgas = lgaList(program.eligibleLgas);
    let lgaOfOrigin = str(body.lgaOfOrigin, 80);
    const hometown = str(body.hometown, 120);
    if (lgas.length) {
      const match = lgas.find((l) => l.toLowerCase() === lgaOfOrigin.toLowerCase());
      if (!match) {
        return res.status(403).json({
          message: `This training is only for indigenes of ${lgas.join(" / ")} Local Government Area.`,
          code: "NOT_ELIGIBLE"
        });
      }
      lgaOfOrigin = match;
      if (hometown.length < 2) return res.status(400).json({ message: "Please enter your ward, village or community" });
      if (body.lgaDeclaration !== true) {
        return res.status(400).json({ message: "Please tick the box to confirm you are an indigene of the Local Government Area" });
      }
    }

    let user = req.user;
    let tokens = null;

    if (!user) {
      const email = str(body.email, 120).toLowerCase();
      const password = String(body.password || "");
      if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address" });
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      if (await User.exists({ email })) {
        return res.status(409).json({
          message: "You already have a StudentToolsNG account with this email. Log in first, then register.",
          code: "ACCOUNT_EXISTS"
        });
      }
      user = await User.create({
        username: await freeUsername(fullName),
        email,
        password: await bcrypt.hash(password, 10),
        verificationToken: crypto.randomBytes(32).toString("hex")
      });
      tokens = { accessToken: generateAccessToken(user), refreshToken: generateRefreshToken(user) };
      user.refreshToken = tokens.refreshToken;
      await user.save();
    }

    const existing = await ProgramApplication.findOne({ program: program._id, batch: program.batch, user: user._id });
    if (existing) {
      return res.status(409).json({
        message: `You have already registered for ${program.batch}.`,
        code: "ALREADY_APPLIED",
        application: { status: existing.status, batch: existing.batch }
      });
    }

    const application = await ProgramApplication.create({
      program: program._id,
      batch: program.batch,
      user: user._id,
      fullName,
      email: user.email.toLowerCase(),
      phone,
      gender: str(body.gender, 20),
      ageRange: str(body.ageRange, 20),
      location: str(body.location, 80),
      lgaOfOrigin,
      hometown,
      lgaDeclaredAt: lgas.length ? new Date() : null,
      educationLevel: str(body.educationLevel, 60),
      occupation: str(body.occupation, 80),
      hasLaptop: str(body.hasLaptop, 10),
      experience: str(body.experience, 60),
      howHeard: str(body.howHeard, 80),
      motivation: str(body.motivation, 1000)
    });

    res.status(201).json({
      ok: true,
      application: { status: application.status, batch: application.batch },
      ...(tokens || {})
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "You have already registered.", code: "ALREADY_APPLIED" });
    res.status(500).json({ message: err.message });
  }
};

// ================================================================ admin

const ADMIN_EDITABLE = ["title", "sponsorName", "sponsorLogoUrl", "tagline", "description", "details", "eligibleLgas", "eligibleState", "batch", "pausedMessage"];

export const adminListPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ createdAt: -1 }).lean();
    const counts = await ProgramApplication.aggregate([
      { $group: { _id: { program: "$program", batch: "$batch", status: "$status" }, n: { $sum: 1 } } }
    ]);
    const out = programs.map((p) => {
      const mine = counts.filter((c) => String(c._id.program) === String(p._id));
      const batchCount = (s) => mine.filter((c) => c._id.batch === p.batch && c._id.status === s).reduce((a, c) => a + c.n, 0);
      return {
        ...p,
        total: mine.reduce((a, c) => a + c.n, 0),
        pending: batchCount("pending"),
        accepted: batchCount("accepted")
      };
    });
    res.json(out);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminCreateProgram = async (req, res) => {
  try {
    const title = str(req.body?.title);
    if (!title) return res.status(400).json({ message: "Title is required" });
    const slug = slugify(req.body.slug || title, { lower: true, strict: true });
    if (!slug) return res.status(400).json({ message: "Title needs some letters or numbers" });
    if (await Program.exists({ slug })) return res.status(400).json({ message: `A programme with the link "/programs/${slug}" already exists` });

    const data = { title, slug };
    for (const k of ADMIN_EDITABLE) if (k !== "title" && req.body[k] !== undefined) data[k] = str(req.body[k], 4000);
    if (Array.isArray(req.body.courses)) data.courses = req.body.courses;
    const p = await Program.create(data);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminGetProgram = async (req, res) => {
  try {
    const p = await Program.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Programme not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateProgram = async (req, res) => {
  try {
    const p = await Program.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Programme not found" });

    for (const k of ADMIN_EDITABLE) if (req.body[k] !== undefined) p[k] = str(req.body[k], 4000);
    if (!p.title) return res.status(400).json({ message: "Title is required" });
    if (!p.batch) p.batch = "Batch 1";

    if (req.body.slug !== undefined) {
      const slug = slugify(String(req.body.slug), { lower: true, strict: true });
      if (!slug) return res.status(400).json({ message: "The link needs some letters or numbers" });
      if (await Program.exists({ slug, _id: { $ne: p._id } })) {
        return res.status(400).json({ message: `A programme with the link "/programs/${slug}" already exists` });
      }
      p.slug = slug;
    }
    if (req.body.status !== undefined) {
      if (!["draft", "open", "paused", "closed"].includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
      p.status = req.body.status;
    }

    let coursesAdded = [];
    if (Array.isArray(req.body.courses)) {
      const before = new Set(p.courses.map(String));
      p.courses = [...new Set(req.body.courses.map(String))];
      coursesAdded = p.courses.filter((id) => !before.has(String(id)));
    }
    await p.save();

    // A course linked after people were accepted: give it to them too.
    if (coursesAdded.length) {
      const accepted = await ProgramApplication.find({ program: p._id, status: "accepted" });
      const only = { ...p.toObject(), courses: coursesAdded };
      for (const a of accepted) {
        const note = await grantProgramAccess(a, only);
        if (!a.accessNote) { a.accessNote = note; await a.save(); }
      }
    }
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminListApplications = async (req, res) => {
  try {
    const p = await Program.findById(req.params.id).select("batch");
    if (!p) return res.status(404).json({ message: "Programme not found" });
    const q = { program: p._id };
    if (req.query.status && req.query.status !== "all") q.status = req.query.status;
    if (req.query.batch && req.query.batch !== "all") q.batch = req.query.batch;
    const [apps, batches] = await Promise.all([
      ProgramApplication.find(q).sort({ createdAt: -1 }).limit(2000).lean(),
      ProgramApplication.distinct("batch", { program: p._id })
    ]);
    res.json({ applications: apps, batches: [...new Set([p.batch, ...batches])] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk accept / reject / back to pending. Accepting grants course access at
// once and emails the student; moving away from accepted revokes it.
export const adminDecideApplications = async (req, res) => {
  try {
    const { ids, action, sendEmail = true } = req.body || {};
    const to = { accept: "accepted", reject: "rejected", pending: "pending" }[action];
    if (!to || !Array.isArray(ids) || !ids.length) return res.status(400).json({ message: "Choose applications and an action" });

    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: "Programme not found" });

    const apps = await ProgramApplication.find({ _id: { $in: ids }, program: program._id });
    let changed = 0;
    const toEmail = [];
    for (const a of apps) {
      if (a.status === to) continue;
      if (to === "accepted") {
        a.accessNote = await grantProgramAccess(a, program);
      } else if (a.status === "accepted") {
        await revokeProgramAccess(a, program);
        a.accessNote = "";
      }
      a.status = to;
      a.decidedAt = new Date();
      await a.save();
      changed++;

      if (to === "accepted" && sendEmail) toEmail.push(a);
    }

    // Access is already on; emails go out after the response so accepting
    // a whole batch at once never waits on the mail server.
    res.json({ changed, emailing: toEmail.length });
    for (const a of toEmail) {
      try {
        await sendAcceptedEmail(a, program);
        await ProgramApplication.updateOne({ _id: a._id }, { acceptedEmailAt: new Date() });
      } catch (e) {
        console.error("PROGRAM ACCEPT EMAIL FAILED:", a.email, e.message);
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminResendAcceptedEmail = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    const a = await ProgramApplication.findOne({ _id: req.params.appId, program: req.params.id });
    if (!program || !a) return res.status(404).json({ message: "Not found" });
    if (a.status !== "accepted") return res.status(400).json({ message: "Only accepted students get this email" });
    await sendAcceptedEmail(a, program);
    a.acceptedEmailAt = new Date();
    await a.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: `Email failed: ${err.message}` });
  }
};
