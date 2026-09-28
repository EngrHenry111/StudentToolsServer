// FILE: /scripts/auditTutorialDepth.js
//
// REPORT ONLY — never writes to the database, never generates content.
//
// Scans every published tutorial and flags ones that are likely too thin
// to be genuinely useful (word count is used as a practical proxy — see
// support.google.com/adsense/answer/10015918 on "low value content").
// A human decides what to do with each flagged article; this script does
// not draft or expand anything.
//
// Word count is computed two ways:
//   - bodyWords:  text with heading tags (h1-h6) removed first — this is
//                 the actual explanatory prose, not section titles
//   - totalWords: everything, headings included
// Flagging uses bodyWords, since a page that's mostly heading text with
// little prose under each is exactly the "thin" pattern to catch.
//
// Run with:  node scripts/auditTutorialDepth.js [--threshold=400]

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Tutorial from "../models/tutorialModel.js";
import { normalizeTutorialContent } from "../utils/normalizeHtml.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(__dirname, "reports");

const thresholdArg = process.argv.find((a) => a.startsWith("--threshold="));
const THRESHOLD = thresholdArg ? Number(thresholdArg.split("=")[1]) : 400;

const countWords = (text) =>
  text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

const stripTags = (html) => html.replace(/<[^>]+>/g, " ");

const analyzeContent = (rawHtml = "") => {
  const clean = normalizeTutorialContent(rawHtml);

  const withoutHeadings = clean.replace(
    /<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi,
    " "
  );

  const bodyWords = countWords(stripTags(withoutHeadings));
  const totalWords = countWords(stripTags(clean));

  return { bodyWords, totalWords };
};

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
  console.log(`Threshold: flagging published articles under ${THRESHOLD} body words.\n`);

  const tutorials = await Tutorial.find({ status: "published" })
    .select("title slug category topic content createdAt updatedAt")
    .sort({ category: 1, topic: 1, title: 1 })
    .lean();

  const results = tutorials.map((t) => {
    const { bodyWords, totalWords } = analyzeContent(t.content);
    return {
      _id: String(t._id),
      title: t.title,
      slug: t.slug,
      category: t.category,
      topic: t.topic,
      bodyWords,
      totalWords,
      flagged: bodyWords < THRESHOLD
    };
  });

  const flagged = results.filter((r) => r.flagged).sort((a, b) => a.bodyWords - b.bodyWords);

  console.log(`Published tutorials scanned: ${results.length}`);
  console.log(`Flagged (< ${THRESHOLD} body words): ${flagged.length}\n`);

  if (flagged.length) {
    console.table(
      flagged.map((r) => ({
        id: r._id,
        title: r.title?.slice(0, 45),
        category: r.category,
        topic: r.topic,
        "body words": r.bodyWords,
        "total words": r.totalWords
      }))
    );
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = path.join(REPORT_DIR, `tutorial-depth-audit-${stamp}`);

  fs.writeFileSync(
    `${base}.json`,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        threshold: THRESHOLD,
        scanned: results.length,
        flaggedCount: flagged.length,
        flagged,
        all: results
      },
      null,
      2
    )
  );

  const header = ["_id", "title", "slug", "category", "topic", "bodyWords", "totalWords"];
  const rows = flagged.map((r) => header.map((h) => csvCell(r[h])).join(","));
  fs.writeFileSync(`${base}.csv`, [header.join(","), ...rows].join("\n"));

  console.log(`\nReports written:\n  ${base}.json\n  ${base}.csv`);
  console.log("\nNo content was changed. Review the flagged list and expand these manually.");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Depth audit failed:", err);
  process.exit(1);
});
