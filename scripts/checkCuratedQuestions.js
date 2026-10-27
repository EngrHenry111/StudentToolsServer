// FILE: /scripts/checkCuratedQuestions.js
//
// Offline checks for data/curatedQuestions.js (no database): required fields,
// four distinct options, correctAnswer among them, known subject/topic, no
// repeated or near-identical questions, and no overlap with the free JAMB CBT
// bank in the client repo (Pro should never just repeat the free questions).
//
// Run with:  node scripts/checkCuratedQuestions.js

import path from "path";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
import { curatedQuestions } from "../data/curatedQuestions.js";
import { batchQuestions } from "../data/curated/index.js";
import { topicBank } from "../services/topicBank.js";

// Numbers count (they are what tell two maths questions apart); filler words don't.
const STOP = new Set("the and for with what which find when from that this these its are was has have how into than then each given".split(" "));
const words = (s) =>
  new Set(
    s.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ")
      .filter((w) => (/^\d+$/.test(w) || w.length > 2) && !STOP.has(w))
  );
const similarity = (a, b) => {
  const A = words(a);
  const B = words(b);
  const shared = [...A].filter((w) => B.has(w)).length;
  return (2 * shared) / Math.max(1, A.size + B.size);
};
const loose = (s) => s.toLowerCase().replace(/\s+/g, "");

const problems = [];
const flag = (q, msg) => problems.push(`${q.examBody || "-"} ${q.subject}: ${msg}\n    "${q.question.slice(0, 90)}"`);

curatedQuestions.forEach((q) => {
  if (!q.subject || !q.topic || !q.question || !q.correctAnswer) flag(q, "missing field");
  if (!Array.isArray(q.options) || q.options.length !== 4) flag(q, "needs exactly 4 options");
  // Case-sensitive: stress questions differ only by capitals (PHOtographer).
  else if (new Set(q.options.map((o) => o.replace(/\s+/g, ""))).size !== 4) flag(q, "duplicate options");
  if (!q.options?.includes(q.correctAnswer)) flag(q, "correctAnswer is not one of the options");
  if (!q.explanation || q.explanation.length < 20) flag(q, "explanation missing or too short");
  if (!topicBank[q.subject]?.includes(q.topic)) flag(q, `topic "${q.topic}" not in topicBank`);
  if (!["easy", "medium", "hard"].includes(q.difficulty)) flag(q, `bad difficulty "${q.difficulty}"`);
});

for (let i = 0; i < curatedQuestions.length; i++) {
  for (let j = i + 1; j < curatedQuestions.length; j++) {
    const a = curatedQuestions[i];
    const b = curatedQuestions[j];
    if (a.subject !== b.subject) continue;
    if (loose(a.question) === loose(b.question)) flag(b, "exact duplicate question");
    else if (similarity(a.question, b.question) >= 0.8 && a.correctAnswer === b.correctAnswer)
      flag(b, `near-duplicate of "${a.question.slice(0, 60)}"`);
  }
}

// The free CBT bank lives in the client repo; skip this check if it isn't checked out.
const cbtDir = path.resolve("../StudentToolsClient/src/utils/cbt");
const free = [];
for (const [file, subject] of [["mathematics", "mathematics"], ["physics", "physics"], ["chemistry", "chemistry"], ["biology", "biology"]]) {
  const f = path.join(cbtDir, `${file}.js`);
  if (!existsSync(f)) continue;
  const mod = await import(pathToFileURL(f).href);
  for (const item of Object.values(mod)[0]) free.push({ subject, q: item.q, answer: item.o[item.a] });
}
// Only the batch files: the older hand-written questions are already live.
for (const q of batchQuestions) {
  for (const f of free) {
    if (f.subject !== q.subject) continue;
    if (similarity(q.question, f.q) >= 0.7 && loose(q.correctAnswer) === loose(f.answer))
      flag(q, `repeats free CBT question "${f.q.slice(0, 60)}"`);
  }
}

const counts = {};
for (const q of curatedQuestions) {
  const k = `${q.examBody || "-"} ${q.subject}`;
  counts[k] = (counts[k] || 0) + 1;
}
console.table(counts);
console.log(`${curatedQuestions.length} questions; checked against ${free.length} free CBT questions.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(" -", p);
  process.exit(1);
}
console.log("ALL CLEAN");
