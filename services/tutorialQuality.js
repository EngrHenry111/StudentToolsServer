// Tutorial quality checks: duplicate topics, repeated / copied content and
// SEO keyword usage. Used by create/update (to block duplicates) and by the
// admin "check" endpoint (to show live warnings while writing).

import crypto from "crypto";
import Tutorial from "../models/tutorialModel.js";
import { htmlToPlainText } from "../utils/normalizeHtml.js";

// Thresholds. Content overlap is measured as the share of this tutorial's
// 5-word shingles that also appear in another tutorial (containment), so a
// short draft copied out of a long article still scores high.
export const LIMITS = {
  titleBlock: 0.85,      // near-identical title → blocked
  titleWarn: 0.6,        // similar title in the same topic → confirm
  contentBlock: 0.8,     // mostly copied from an existing tutorial → blocked
  contentWarn: 0.4,      // large overlap → confirm
  minRepeatChars: 60     // ignore short repeated lines ("Example:", etc.)
};

const STOPWORDS = new Set(
  ("a an and are as at be by for from how in into is it its of on or that the " +
    "this to what when where which why with your you vs versus guide tutorial " +
    "introduction intro basics complete simple easy explained understanding " +
    "learn learning beginners beginner notes part").split(" ")
);

export const escapeRegex = (s = "") =>
  String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const words = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

// Crude stemmer: enough to treat "laws"/"law" or "equations"/"equation" alike.
const stem = (w) =>
  w.length > 4 ? w.replace(/(ies|es|s|ing|ed)$/, "") : w;

export const titleTokens = (title = "") =>
  new Set(words(title).filter((w) => !STOPWORDS.has(w)).map(stem));

const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

export const titleSimilarity = (a, b) => jaccard(titleTokens(a), titleTokens(b));

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

export const contentHash = (plain = "") =>
  crypto
    .createHash("sha1")
    .update(words(plain).join(" "))
    .digest("hex");

// Paragraphs / list items that appear more than once inside the same body.
export const findRepeatedBlocks = (html = "") => {
  const blocks = String(html)
    .split(/<\/(?:p|li|h[1-6]|blockquote|pre|div)>/i)
    .map((b) => htmlToPlainText(b).replace(/\s+/g, " ").trim())
    .filter((b) => b.length >= LIMITS.minRepeatChars);

  const counts = new Map();
  for (const b of blocks) {
    const key = words(b).join(" ");
    const entry = counts.get(key) || { text: b, count: 0 };
    entry.count++;
    counts.set(key, entry);
  }

  return [...counts.values()]
    .filter((e) => e.count > 1)
    .map((e) => ({ text: e.text.slice(0, 160), count: e.count }));
};

export const parseKeywords = (value) => {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(list.map((k) => String(k).toLowerCase().trim()).filter(Boolean))].slice(0, 15);
};

const countPhrase = (haystackWords, phrase) => {
  const p = words(phrase);
  if (!p.length) return 0;
  let n = 0;
  for (let i = 0; i + p.length <= haystackWords.length; i++) {
    let ok = true;
    for (let j = 0; j < p.length; j++) {
      if (stem(haystackWords[i + j]) !== stem(p[j])) { ok = false; break; }
    }
    if (ok) n++;
  }
  return n;
};

const hasPhrase = (text, phrase) => countPhrase(words(text), phrase) > 0;

// SEO report for the focus keyword. Returns checks the editor can act on.
export const seoReport = ({ title = "", excerpt = "", html = "", focusKeyword = "", keywords = [] }) => {
  const plain = htmlToPlainText(html);
  const bodyWords = words(plain);
  const wordCount = bodyWords.length;
  const firstPara = bodyWords.slice(0, 100).join(" ");
  const headings = (String(html).match(/<h[2-3][^>]*>[\s\S]*?<\/h[2-3]>/gi) || [])
    .map((h) => htmlToPlainText(h));
  const kw = focusKeyword.toLowerCase().trim();

  const checks = [];
  const add = (ok, message, level = "warn") => checks.push({ ok, level: ok ? "ok" : level, message });

  add(wordCount >= 600, `Body has ${wordCount} words (aim for 600+ for a full tutorial).`);
  add(title.length >= 30 && title.length <= 65, `Title is ${title.length} characters (30–65 shows fully in Google).`);
  add(excerpt.length >= 70 && excerpt.length <= 160, `Excerpt is ${excerpt.length} characters (70–160 for the meta description).`);

  let density = 0;
  if (!kw) {
    add(false, "No focus keyword set — add the main phrase students would search for.", "error");
  } else {
    const hits = countPhrase(bodyWords, kw);
    density = wordCount ? (hits * words(kw).length * 100) / wordCount : 0;
    add(hasPhrase(title, kw), `Focus keyword ${hasPhrase(title, kw) ? "is" : "is not"} in the title.`, "error");
    add(hasPhrase(excerpt, kw), `Focus keyword ${hasPhrase(excerpt, kw) ? "is" : "is not"} in the excerpt.`);
    add(hasPhrase(firstPara, kw), `Focus keyword ${hasPhrase(firstPara, kw) ? "appears" : "does not appear"} in the first 100 words.`);
    add(headings.some((h) => hasPhrase(h, kw)), "Focus keyword in at least one H2/H3 subheading.");
    add(
      density >= 0.5 && density <= 2.5,
      `Keyword density ${density.toFixed(1)}% (${hits}×) — keep between 0.5% and 2.5%.`
    );
  }

  const missingKeywords = keywords.filter((k) => k !== kw && !hasPhrase(plain, k));
  if (keywords.length) {
    add(!missingKeywords.length, missingKeywords.length
      ? `Keywords not used in the body: ${missingKeywords.join(", ")}.`
      : "All secondary keywords appear in the body.");
  }

  return { wordCount, density: Number(density.toFixed(2)), checks };
};

// Shingle sets per tutorial, reused until the tutorial's updatedAt changes,
// so a check only downloads and re-shingles bodies that are new or edited.
const shingleCache = new Map(); // id -> { stamp, set }

const loadShingles = async (others, excludeId) => {
  const stale = others.filter((t) => {
    const hit = shingleCache.get(String(t._id));
    return !hit || hit.stamp !== String(t.updatedAt);
  });

  if (stale.length) {
    const docs = await Tutorial.find({ _id: { $in: stale.map((t) => t._id) } })
      .select("content updatedAt")
      .lean();
    for (const d of docs) {
      shingleCache.set(String(d._id), {
        stamp: String(d.updatedAt),
        set: shingles(htmlToPlainText(d.content))
      });
    }
  }

  // Drop deleted tutorials (the one being edited is excluded from `others`).
  const live = new Set(others.map((t) => String(t._id)));
  if (excludeId) live.add(String(excludeId));
  for (const id of shingleCache.keys()) if (!live.has(id)) shingleCache.delete(id);
};

/*
Full check. `excludeId` skips the tutorial being edited.
Returns { blocking, warnings, titleMatches, contentMatches, repeatedBlocks,
          keywordConflicts, seo }.
*/
export const checkTutorial = async ({
  title = "",
  content = "",
  category = "",
  topic = "",
  excerpt = "",
  focusKeyword = "",
  keywords = [],
  excludeId = null
}) => {
  const plain = htmlToPlainText(content);
  const mine = shingles(plain);
  const hash = plain ? contentHash(plain) : "";
  const kw = focusKeyword.toLowerCase().trim();

  const filter = excludeId ? { _id: { $ne: excludeId } } : {};
  const others = await Tutorial.find(filter)
    .select("title slug category topic status contentHash focusKeyword updatedAt")
    .lean();
  if (mine.size) await loadShingles(others, excludeId);

  const titleMatches = [];
  const contentMatches = [];
  const keywordConflicts = [];

  for (const t of others) {
    const ref = { id: t._id, title: t.title, slug: t.slug, status: t.status, category: t.category, topic: t.topic };

    const exactTitle = t.title.trim().toLowerCase() === title.trim().toLowerCase();
    const tSim = exactTitle ? 1 : titleSimilarity(title, t.title);
    const sameTopic = topic && t.topic === topic && t.category === category;
    if (tSim >= LIMITS.titleBlock || (sameTopic && tSim >= LIMITS.titleWarn)) {
      titleMatches.push({ ...ref, similarity: Number(tSim.toFixed(2)), sameTopic: Boolean(sameTopic) });
    }

    if (mine.size) {
      const identical = hash && t.contentHash === hash;
      const theirs = shingleCache.get(String(t._id))?.set || new Set();
      const cSim = identical ? 1 : containment(mine, theirs);
      if (cSim >= LIMITS.contentWarn) {
        contentMatches.push({ ...ref, overlap: Number(cSim.toFixed(2)) });
      }
    }

    if (kw && t.focusKeyword && t.focusKeyword === kw) keywordConflicts.push(ref);
  }

  titleMatches.sort((a, b) => b.similarity - a.similarity);
  contentMatches.sort((a, b) => b.overlap - a.overlap);

  const repeatedBlocks = findRepeatedBlocks(content);

  const blocking = [];
  const warnings = [];

  const topTitle = titleMatches[0];
  if (topTitle && topTitle.similarity >= LIMITS.titleBlock) {
    blocking.push(`A tutorial with almost the same title already exists: "${topTitle.title}".`);
  } else if (topTitle) {
    warnings.push(`"${topTitle.title}" already covers a similar title in ${topTitle.category} › ${topTitle.topic}.`);
  }

  const topContent = contentMatches[0];
  if (topContent && topContent.overlap >= LIMITS.contentBlock) {
    blocking.push(`${Math.round(topContent.overlap * 100)}% of this content is already in "${topContent.title}".`);
  } else if (topContent) {
    warnings.push(`${Math.round(topContent.overlap * 100)}% of this content overlaps "${topContent.title}".`);
  }

  if (repeatedBlocks.length) {
    warnings.push(`${repeatedBlocks.length} paragraph(s) are repeated inside this tutorial.`);
  }

  if (keywordConflicts.length) {
    warnings.push(`Focus keyword "${kw}" is already targeted by "${keywordConflicts[0].title}" — the two pages will compete in Google.`);
  }

  return {
    blocking,
    warnings,
    titleMatches: titleMatches.slice(0, 5),
    contentMatches: contentMatches.slice(0, 5),
    repeatedBlocks,
    keywordConflicts: keywordConflicts.slice(0, 5),
    seo: seoReport({ title, excerpt, html: content, focusKeyword: kw, keywords }),
    contentHash: hash
  };
};
