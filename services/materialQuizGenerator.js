import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// Most course material comfortably fits in a modern LLM's context
// window, so this deliberately does direct-context generation rather
// than building a full RAG/vector-database pipeline — that's real
// infrastructure that only pays for itself once documents/users are
// large enough that this stops being sufficient. If a document is
// unusually long, truncate to a safe size rather than fail outright.
const MAX_CHARS = 18000;

const truncateText = (text) => {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS) + "\n\n[...material truncated for length...]";
};

// Generates questions in SEVERAL DIFFERENT FORMATS testing the SAME
// underlying concepts — this is the actual differentiator here. Most
// quiz tools test a fact once, in one shape. This drills each concept
// from multiple angles (straight MCQ, true/false, fill-in-the-blank,
// a reworded scenario) so however the real exam ends up phrasing it,
// the student has already practiced a version of that exact idea.
//
// All formats are represented as standard multiple-choice under the
// hood (true/false as a 2-option MCQ, fill-in-the-blank as an MCQ with
// plausible distractor words) so the entire existing quiz-taking UI,
// submission, scoring, and review pipeline works with ZERO changes —
// this was a deliberate scope decision, not an oversight.
export const generateMaterialQuiz = async ({ text, questionCount = 10 }) => {
  const material = truncateText(text);

  // Roughly 2-3 formats per concept, so ask for enough distinct
  // concepts to cover the requested question count.
  const conceptCount = Math.max(3, Math.ceil(questionCount / 2.5));

  const prompt = `
You are an expert exam-prep tutor. A student has uploaded their own course
material below. Your job is to build a practice quiz STRICTLY from this
material — do not introduce outside facts, even if you know them, and do
not correct or expand on the material's content.

MATERIAL:
"""
${material}
"""

Identify ${conceptCount} distinct, important concepts/facts from this material
that a student would realistically be examined on.

For EACH concept, generate 2-3 questions in DIFFERENT formats testing that
SAME concept, so however an exam phrases it, the student has already
practiced a version of it. Use a mix of these formats across the quiz:

- "mcq": a standard question with 4 plausible options
- "true_false": a true/false statement about the concept, with exactly 2 options: "True" and "False"
- "fill_blank": a sentence with one key term removed, phrased as "___ is responsible for X", with 4 plausible word/phrase options
- "scenario": the SAME concept, reworded as a short applied scenario or example, with 4 options

Generate approximately ${questionCount} questions total across all concepts and formats.

Rules:
- Every question and its correct answer must be verifiable directly from the material above
- Do NOT invent facts not present in the material
- Options must be plausible, not obviously wrong
- correctAnswer must be an EXACT match to one of the option strings
- Do not prefix options with "A.", "B.", etc — plain text only

Respond with ONLY a JSON array, no markdown, no extra text:
[
  {
    "conceptTag": "short label for the underlying concept, e.g. 'Photosynthesis definition'",
    "format": "mcq" | "true_false" | "fill_blank" | "scenario",
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "correctAnswer": "...",
    "explanation": "one sentence, referencing the material"
  }
]
`;

  // Same retry pattern as the proven-working subject-quiz generator —
  // transient failures (network blip, momentary rate limit) shouldn't
  // force a student to redo an entire upload from scratch.
  const callAI = async (retries = 2) => {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "Return ONLY valid JSON. Never introduce facts outside the given material." },
          { role: "user", content: prompt }
        ]
      });
      return completion.choices[0].message.content;
    } catch (err) {
      if (retries > 0) {
        console.log("Retrying material quiz generation...");
        return callAI(retries - 1);
      }
      throw err;
    }
  };

  const raw = (await callAI())
    .replace(/```json|```/g, "")
    .trim();

  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("AI did not return a valid question list");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw.substring(start, end + 1));
  } catch {
    throw new Error("Failed to parse AI-generated questions");
  }

  // Strip stray "A." / "B)" prefixes some models still add despite
  // instructions, and discard anything structurally broken — same
  // defensive pattern used for the AI subject quizzes.
  const stripPrefix = (t) =>
    typeof t === "string" ? t.replace(/^\s*[A-Da-d1-4][.):]\s*/, "").trim() : t;

  const validFormats = new Set(["mcq", "true_false", "fill_blank", "scenario"]);

  parsed = parsed
    .map((q) => ({
      ...q,
      options: Array.isArray(q.options) ? q.options.map(stripPrefix) : q.options,
      correctAnswer: stripPrefix(q.correctAnswer)
    }))
    .filter((q) =>
      q.question &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      q.correctAnswer &&
      q.options.includes(q.correctAnswer) &&
      validFormats.has(q.format) &&
      q.conceptTag
    );

  return parsed;
};

// Independently re-checks each generated question against the ORIGINAL
// material — the same "second, skeptical opinion" pattern already used
// for the subject-based AI quizzes, adapted here to specifically guard
// against the AI drifting away from the uploaded material (inventing
// facts not actually present, or misreading something in the document).
export const verifyMaterialQuestion = async (question, text) => {
  const material = truncateText(text);

  const verifyPrompt = `
You are a strict fact-checker. Below is a course material excerpt and a
quiz question that claims to be based on it.

MATERIAL:
"""
${material}
"""

QUESTION: ${question.question}
OPTIONS: ${JSON.stringify(question.options)}
CLAIMED CORRECT ANSWER: ${question.correctAnswer}

Verify, using ONLY the material above:
1. Is this question actually answerable from the material (not requiring
   outside knowledge)?
2. Is the claimed correct answer actually correct according to the material?

Respond with ONLY this JSON (no markdown):
{
  "valid": true or false,
  "reason": "one short sentence"
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Return ONLY valid JSON. Be strict — if the material doesn't clearly support the claimed answer, mark it invalid." },
        { role: "user", content: verifyPrompt }
      ]
    });

    const raw = completion.choices[0].message.content
      .replace(/```json|```/g, "")
      .trim();

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return { valid: false };

    return JSON.parse(raw.substring(start, end + 1));

  } catch (err) {
    console.error("MATERIAL QUESTION VERIFY ERROR:", err.message);
    return { valid: false, reason: "verification call failed" };
  }
};
