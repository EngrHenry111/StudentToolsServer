// FILE: /scripts/migrateTutorialContent.js
//
// Fixes tutorial documents whose HTML body was saved entity-escaped
// (e.g. "<p>&lt;h1&gt;Title&lt;/h1&gt;</p>") so the markup renders as tags
// instead of literal text.
//
// DRY RUN IS THE DEFAULT. Without --apply it writes nothing — it only
// prints what it *would* change and saves a report to scripts/reports/.
//
//   node scripts/migrateTutorialContent.js            # dry run (safe)
//   node scripts/migrateTutorialContent.js --apply    # actually writes
//
// Review the dry-run report before ever running with --apply.

import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import Tutorial from "../models/tutorialModel.js";
import {
  normalizeTutorialContent,
  hasEncodedMarkup,
  htmlToPlainText
} from "../utils/normalizeHtml.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(__dirname, "reports");

const APPLY = process.argv.includes("--apply");

const preview = (s, n = 160) =>
  String(s || "").replace(/\s+/g, " ").trim().slice(0, n);

const countOccurrences = (s, re) => (String(s || "").match(re) || []).length;

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to StudentToolsServer/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  console.log(APPLY ? "\n*** MODE: --apply (WILL WRITE) ***\n" : "\nMODE: dry run (no writes)\n");

  const tutorials = await Tutorial.find().sort({ createdAt: 1 });

  const changes = [];

  for (const t of tutorials) {
    const before = t.content || "";
    const after = normalizeTutorialContent(before);

    const contentChanged = after !== before;
    const excerptEncoded = hasEncodedMarkup(t.excerpt || "");

    if (!contentChanged && !excerptEncoded) continue;

    const nextExcerpt = excerptEncoded
      ? (htmlToPlainText(after).slice(0, 150) || t.excerpt)
      : t.excerpt;

    changes.push({
      _id: String(t._id),
      title: t.title,
      slug: t.slug,
      status: t.status,
      contentChanged,
      lengthBefore: before.length,
      lengthAfter: after.length,
      encodedLtRemoved:
        countOccurrences(before, /&lt;/gi) - countOccurrences(after, /&lt;/gi),
      contentBefore: preview(before),
      contentAfter: preview(after),
      excerptEncoded,
      excerptBefore: excerptEncoded ? preview(t.excerpt, 120) : undefined,
      excerptAfter: excerptEncoded ? preview(nextExcerpt, 120) : undefined
    });

    if (APPLY) {
      if (contentChanged) t.content = after;
      if (excerptEncoded) t.excerpt = nextExcerpt;
      await t.save();
      console.log(`  applied → ${t.slug}`);
    }
  }

  console.log(`\nTutorials scanned:  ${tutorials.length}`);
  console.log(`Documents ${APPLY ? "updated" : "that WOULD change"}: ${changes.length}`);

  if (changes.length) {
    console.table(
      changes.map((c) => ({
        id: c._id,
        slug: c.slug?.slice(0, 32),
        status: c.status,
        content: c.contentChanged ? "yes" : "-",
        "&lt; removed": c.encodedLtRemoved,
        excerpt: c.excerptEncoded ? "yes" : "-"
      }))
    );
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const mode = APPLY ? "apply" : "dryrun";
  const file = path.join(REPORT_DIR, `tutorial-content-migration-${mode}-${stamp}.json`);

  fs.writeFileSync(
    file,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        mode: APPLY ? "apply" : "dry-run",
        scanned: tutorials.length,
        changed: changes.length,
        changes
      },
      null,
      2
    )
  );

  console.log(`\nReport written:\n  ${file}`);
  if (!APPLY && changes.length) {
    console.log("\nReview the report, then re-run with --apply to write these changes.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
