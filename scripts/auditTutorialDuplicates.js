// FILE: /scripts/auditTutorialDuplicates.js
//
// REPORT ONLY — never writes to the database.
//
// Compares every tutorial (drafts AND published) against every other one,
// using the same thresholds as the create/update duplicate gate
// (services/tutorialQuality.js), and also reports:
//   - same category + topic covered by more than one tutorial
//   - shared focus keyword (pages competing in Google)
//   - repeated paragraphs inside a single tutorial
//   - drafts that can't be published (category outside the taxonomy)
//
// Run with:  node scripts/auditTutorialDuplicates.js

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import Tutorial from "../models/tutorialModel.js";
import { htmlToPlainText } from "../utils/normalizeHtml.js";
import {
  LIMITS,
  titleSimilarity,
  contentHash,
  findRepeatedBlocks
} from "../services/tutorialQuality.js";
import { tutorialCategoryList } from "../services/tutorialCategories.js";

// Same tokenisation as services/tutorialQuality.js (not exported there).
const words = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

const shingles = (text, n = 5) => {
  const w = words(text);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(" "));
  return out;
};

const containment = (a, b) => {
  if (!a.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / a.size;
};

const label = (t) => `[${t.status || "no-status"}] "${t.title}" (${t.category} › ${t.topic || "-"})`;

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Add it to StudentToolsServer/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const rows = await Tutorial.find()
    .select("title slug category topic status content focusKeyword")
    .lean();

  const items = rows.map((t) => {
    const plain = htmlToPlainText(t.content || "");
    return {
      ...t,
      words: words(plain).length,
      hash: plain ? contentHash(plain) : "",
      sh: shingles(plain)
    };
  });

  const drafts = items.filter((t) => t.status !== "published");
  console.log(`Tutorials: ${items.length} (published ${items.length - drafts.length}, drafts ${drafts.length})\n`);

  const titleHits = [];
  const contentHits = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];

      const tSim = a.title.trim().toLowerCase() === b.title.trim().toLowerCase()
        ? 1
        : titleSimilarity(a.title, b.title);
      const sameTopic = a.topic && a.topic === b.topic && a.category === b.category;
      // Wider than the gate: also any-topic titles ≥ titleWarn, because the
      // gate's same-topic rule can't see legacy rows that have no topic.
      if (tSim >= LIMITS.titleWarn || (sameTopic && tSim >= 0.4)) {
        titleHits.push({ a, b, tSim });
      }

      // Containment is directional — report the larger direction.
      const identical = a.hash && a.hash === b.hash;
      const cSim = identical ? 1 : Math.max(containment(a.sh, b.sh), containment(b.sh, a.sh));
      if (cSim >= 0.25) contentHits.push({ a, b, cSim });
    }
  }

  console.log(`== Similar titles (any topic ≥ ${LIMITS.titleWarn}, same topic ≥ 0.4): ${titleHits.length}`);
  for (const h of titleHits.sort((x, y) => y.tSim - x.tSim)) {
    console.log(`  ${h.tSim.toFixed(2)}  ${label(h.a)}\n        ${label(h.b)}`);
  }

  console.log(`\n== Content overlap ≥ 25% (gate warns at ${LIMITS.contentWarn * 100}%, blocks at ${LIMITS.contentBlock * 100}%): ${contentHits.length}`);
  for (const h of contentHits.sort((x, y) => y.cSim - x.cSim)) {
    console.log(`  ${Math.round(h.cSim * 100)}%  ${label(h.a)}\n        ${label(h.b)}`);
  }

  const byTopic = new Map();
  for (const t of items) {
    if (!t.topic) continue;
    const key = `${t.category} › ${t.topic}`;
    byTopic.set(key, [...(byTopic.get(key) || []), t]);
  }
  const shared = [...byTopic].filter(([, list]) => list.length > 1);
  console.log(`\n== Topics with more than one tutorial (fine if each covers a different angle): ${shared.length}`);
  for (const [key, list] of shared) {
    console.log(`  ${key}`);
    for (const t of list) console.log(`     - [${t.status || "no-status"}] ${t.title}`);
  }

  const byKw = new Map();
  for (const t of items) {
    const kw = (t.focusKeyword || "").trim();
    if (kw) byKw.set(kw, [...(byKw.get(kw) || []), t]);
  }
  const kwClash = [...byKw].filter(([, list]) => list.length > 1);
  console.log(`\n== Shared focus keyword: ${kwClash.length}`);
  for (const [kw, list] of kwClash) {
    console.log(`  "${kw}": ${list.map((t) => `"${t.title}"`).join(", ")}`);
  }

  const repeats = items
    .map((t) => ({ t, blocks: findRepeatedBlocks(t.content || "") }))
    .filter((r) => r.blocks.length);
  console.log(`\n== Repeated paragraphs inside a tutorial: ${repeats.length}`);
  for (const r of repeats) console.log(`  ${label(r.t)} — ${r.blocks.length} block(s)`);

  console.log(`\n== Drafts (${drafts.length}) — publish readiness`);
  for (const t of drafts.sort((x, y) => x.category.localeCompare(y.category))) {
    const okCategory = tutorialCategoryList.includes(t.category);
    const flags = [];
    if (!okCategory) flags.push("category outside taxonomy — needs a new category");
    if (!t.topic) flags.push("no topic");
    if (t.words < 300) flags.push(`thin (${t.words} words)`);
    console.log(`  ${flags.length ? "✗" : "✓"} ${label(t)} — ${t.words} words${flags.length ? " — " + flags.join("; ") : ""}`);
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
