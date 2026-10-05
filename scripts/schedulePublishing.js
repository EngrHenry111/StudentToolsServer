// Spread draft tutorials over the coming days by setting publishAt;
// jobs/scheduledPublishJob.js then publishes each one when it falls due.
//
// Dry run:  node scripts/schedulePublishing.js
// Apply:    node scripts/schedulePublishing.js --apply [--per-day 5] [--start 2026-10-05]
//
// Drafts are taken oldest first and interleaved across the categories below,
// so each day mixes subjects. Already-scheduled drafts are left alone.
import dotenv from "dotenv";
import mongoose from "mongoose";
import Tutorial from "../models/tutorialModel.js";

dotenv.config();

const CATEGORIES = ["physics", "mathematics", "programming"];
// Go-live times in WAT (UTC+1): 08:00, 10:30, 13:00, 15:30, 18:00, …
const SLOT_MINUTES_WAT = [480, 630, 780, 930, 1080, 1230];

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? fallback : process.argv[i + 1];
};

const APPLY = process.argv.includes("--apply");
const perDay = Number(arg("--per-day", 5));
const start = arg("--start", new Date().toISOString().slice(0, 10));

if (!(perDay >= 1 && perDay <= SLOT_MINUTES_WAT.length)) {
  throw new Error(`--per-day must be between 1 and ${SLOT_MINUTES_WAT.length}`);
}

const slotTime = (index) => {
  const day = Math.floor(index / perDay);
  const minutesWat = SLOT_MINUTES_WAT[index % perDay];
  const date = new Date(`${start}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + day);
  date.setUTCMinutes(minutesWat - 60);          // WAT -> UTC
  return date;
};

await mongoose.connect(process.env.MONGO_URI);

const queues = [];
for (const category of CATEGORIES) {
  queues.push(await Tutorial.find({
    status: "draft",
    category,
    publishAt: { $exists: false }
  }).sort({ createdAt: 1 }).select("title category"));
}

const ordered = [];
while (queues.some((q) => q.length)) {
  for (const q of queues) if (q.length) ordered.push(q.shift());
}

const plan = ordered.map((t, i) => ({ t, at: slotTime(i) }));
for (const { t, at } of plan.slice(0, 8)) {
  console.log(at.toISOString(), t.category.padEnd(12), t.title);
}
if (plan.length > 8) {
  const last = plan[plan.length - 1];
  console.log(`… ${plan.length} drafts in total; last one goes live ${last.at.toISOString()}`);
}

if (APPLY && plan.length) {
  const result = await Tutorial.bulkWrite(plan.map(({ t, at }) => ({
    updateOne: { filter: { _id: t._id }, update: { $set: { publishAt: at } } }
  })));
  console.log(`Scheduled ${result.modifiedCount} drafts.`);
} else if (!APPLY) {
  console.log("Dry run only. Re-run with --apply to save.");
}

await mongoose.disconnect();
