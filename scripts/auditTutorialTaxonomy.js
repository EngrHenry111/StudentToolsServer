// FILE: /scripts/auditTutorialTaxonomy.js
//
// REPORT ONLY — never writes to the database.
//
// Scans every tutorial and flags category/topic values that don't match the
// clean taxonomy in services/tutorialCategories.js. Writes a JSON + CSV
// report to scripts/reports/ and prints a summary table.
//
// A human reviews the report and decides each correction manually — an
// automatic guess could silently misfile real content.
//
// Run with:  node scripts/auditTutorialTaxonomy.js

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Tutorial from "../models/tutorialModel.js";
import {
  isValidTutorialCategory,
  isCleanTopicSlug,
  topicSlug,
  tutorialCategoryList
} from "../services/tutorialCategories.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(__dirname, "reports");

const csvCell = (value) => {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to StudentToolsServer/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.\n");

  const tutorials = await Tutorial.find()
    .select("title slug status category topic createdAt")
    .sort({ createdAt: 1 })
    .lean();

  const offenders = [];

  for (const t of tutorials) {
    const category = String(t.category || "").toLowerCase().trim();
    const topic = String(t.topic || "");
    const categoryValid = isValidTutorialCategory(category);
    // Topic is not whitelisted — it only has to be a clean kebab-case slug.
    const topicValid = isCleanTopicSlug(topic);

    if (categoryValid && topicValid) continue;

    const reasons = [];
    if (!categoryValid) {
      reasons.push(
        t.category ? `category "${t.category}" not in whitelist` : "category is empty"
      );
    }
    if (!topicValid) {
      reasons.push(t.topic ? `topic "${t.topic}" is not a clean slug` : "topic is empty");
    }

    offenders.push({
      _id: String(t._id),
      title: t.title,
      slug: t.slug,
      status: t.status ?? null,
      category: t.category ?? null,
      categoryValid,
      topic: t.topic ?? null,
      topicSlugified: topicSlug(topic),
      topicValid,
      reasons: reasons.join("; ")
    });
  }

  // ---- console summary ----
  console.log(`Tutorials scanned:        ${tutorials.length}`);
  console.log(`Clean (category + topic): ${tutorials.length - offenders.length}`);
  console.log(`Flagged for review:       ${offenders.length}`);
  console.log(`\nValid categories: ${tutorialCategoryList.join(", ")}\n`);

  if (offenders.length) {
    console.table(
      offenders.map((o) => ({
        id: o._id,
        title: o.title?.slice(0, 40),
        status: o.status,
        category: o.category,
        "cat ok": o.categoryValid ? "y" : "NO",
        topic: o.topic,
        "topic ok": o.topicValid ? "y" : "NO"
      }))
    );
  }

  // ---- report files ----
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = path.join(REPORT_DIR, `tutorial-taxonomy-audit-${stamp}`);

  fs.writeFileSync(
    `${base}.json`,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), scanned: tutorials.length, flagged: offenders.length, offenders },
      null,
      2
    )
  );

  const header = [
    "_id", "title", "slug", "status",
    "category", "categoryValid", "topic", "topicSlugified", "topicValid", "reasons"
  ];
  const rows = offenders.map((o) =>
    header.map((h) => csvCell(o[h])).join(",")
  );
  fs.writeFileSync(`${base}.csv`, [header.join(","), ...rows].join("\n"));

  console.log(`\nReports written:\n  ${base}.json\n  ${base}.csv`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Audit script failed:", err);
  process.exit(1);
});
