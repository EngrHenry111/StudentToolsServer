import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// Subjects where the model is most prone to real computational errors
// (wrong algebra, invented roots, unsolvable equations presented as
// solvable) — these get an extra independent verification pass before
// a question is accepted. Less numeric subjects skip this to save on
// API calls/latency, since the failure mode there is more about
// opinion/style than a checkable right-or-wrong answer.
const VERIFY_SUBJECTS = new Set([
  "mathematics", "physics", "chemistry", "financialAccounting",
  "biology", "agriculturalScience", "computerScience", "economics"
]);

// Independently re-solves a single question and confirms, corrects, or
// rejects the claimed answer. This catches exactly the failure mode
// reported by real users: a question generated with a wrong or even
// unsolvable "correct answer" (e.g. an equation with no solution, or a
// quadratic's roots misremembered) — a single generation pass has no
// way to catch its own mistakes, so this asks the model to check its
// work independently, the same way a teacher marking a test would.
const verifyQuestion = async (q, subject) => {
  const verifyPrompt = `
You are a strict, independent WAEC/JAMB examiner checking a colleague's work.
You did NOT write this question — verify it from scratch.

Subject: ${subject}
Question: ${q.question}
Options: ${JSON.stringify(q.options)}
Claimed correct answer: ${q.correctAnswer}

Solve the question yourself, independently, step by step in your head.
Then respond with ONLY this JSON (no markdown, no extra text):

{
  "valid": true or false,
  "correctOption": "the exact text of the option you have determined is correct, or null if the question is flawed/unsolvable/has no correct option among those given",
  "reason": "one short sentence explaining your finding"
}

Set "valid" to false if: the question has no solution, more than one option
could be correct, none of the options are correct, or the question is
ambiguous or malformed.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Return ONLY valid JSON. Be strict and skeptical." },
        { role: "user", content: verifyPrompt }
      ]
    });

    const raw = completion.choices[0].message.content
      .replace(/```json|```/g, "")
      .trim();

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) return { valid: false };

    const result = JSON.parse(raw.substring(start, end + 1));

    if (!result.valid) return { valid: false, reason: result.reason };

    // The verifier must have landed on one of the actual options offered —
    // if it names something outside that set, treat it as a failed check
    // rather than trusting an answer that doesn't even match a choice.
    if (!q.options.includes(result.correctOption)) {
      return { valid: false, reason: "Verifier's answer didn't match any option" };
    }

    return { valid: true, correctOption: result.correctOption };

  } catch (err) {
    console.error("VERIFY QUESTION ERROR:", err.message);
    // If verification itself fails (network/API issue), don't silently
    // trust an unverified question for a subject we know needs checking —
    // safer to drop it and regenerate next time than risk a wrong answer.
    return { valid: false, reason: "verification call failed" };
  }
};

export const generateAIQuestions = async ({ subject, topic, count }) => {

  const prompt = `
You are an expert WAEC/JAMB ${subject} examiner.

Generate ${count} high-quality multiple-choice questions on "${topic}" in ${subject}.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations outside JSON
- No comments
- No trailing commas
- Questions must resemble real WAEC/JAMB questions
- Questions must be concise and clear
- Each option must be SHORT
- DO NOT use explanatory sentences as options
- DO NOT prefix options with "A.", "B.", "1)", etc. — plain text only
- ONLY one correct answer
- Wrong options must look realistic
- Avoid options like:
  "We can use formula..."
  "Cannot be determined"
  "Depends on..."
  unless absolutely necessary

Each question object must contain:
- question
- options (exactly 4 plain-text options, no letter/number prefixes)
- correctAnswer (must exactly match one of the strings in "options")
- explanation

FORMAT:

[
  {
    "question": "What is friction?",
    "options": [
      "A resisting force",
      "A magnetic force",
      "An electric force",
      "A nuclear force"
    ],
    "correctAnswer": "A resisting force",
    "explanation": "Friction opposes motion between surfaces."
  }
]
`;

  // 🔁 RETRY FUNCTION
  const callAI = async (retries = 2) => {
    try {
      const completion = await groq.chat.completions.create({
        // llama-3.1-8b-instant was deprecated and shut down by Groq on
        // Aug 16, 2026. openai/gpt-oss-20b is Groq's official replacement.
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "Return ONLY valid JSON." },
          { role: "user", content: prompt }
        ]
      });

      return completion.choices[0].message.content;

    } catch (err) {
      if (retries > 0) {
        console.log("Retrying AI...");
        return callAI(retries - 1);
      }
      throw err;
    }
  };

  // ✅ CALL AI
  let raw = await callAI();

  // 🔥 CLEAN RESPONSE
  raw = raw
    .replace(/```json|```/g, "")
    .replace(/\n/g, " ")
    .trim();

  // 🔥 EXTRACT JSON ARRAY
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");

  if (start === -1 || end === -1) {
    console.error("BAD AI RESPONSE:", raw);
    throw new Error("AI did not return valid JSON array");
  }

  const jsonString = raw.substring(start, end + 1);

  let parsed;

  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("PARSE ERROR RAW:", raw);
    throw new Error("AI returned invalid JSON after cleaning");
  }

//   parsed = parsed.filter(q =>
//   q.question &&
//   Array.isArray(q.options) &&
//   q.options.length === 4 &&
//   q.options.every(opt => opt.length > 3)
// );
// Some models still prefix options with "A.", "B)", "1)" etc. despite
// instructions — strip that so the text always matches what the client
// renders (it draws its own lettered badges) and so correctAnswer
// comparisons stay reliable.
const stripPrefix = (text) =>
  typeof text === "string"
    ? text.replace(/^\s*[A-Da-d1-4][.):]\s*/, "").trim()
    : text;

parsed = parsed.map(q => ({
  ...q,
  options: Array.isArray(q.options) ? q.options.map(stripPrefix) : q.options,
  correctAnswer: stripPrefix(q.correctAnswer)
}));

parsed = parsed.filter(q => {
  return (
    q.question &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.correctAnswer &&
    q.explanation &&
    q.options.includes(q.correctAnswer) &&
    q.options.every(opt => opt.length > 1)
  );
});

// 🔍 INDEPENDENT VERIFICATION PASS (calculation-heavy subjects only)
// Re-solves each question from scratch and either confirms it, silently
// corrects the answer if the verifier finds a different valid option, or
// drops the question entirely if it turns out to be wrong/unsolvable —
// so a broken question never reaches a student in the first place.
if (VERIFY_SUBJECTS.has(subject)) {
  const verified = [];

  for (const q of parsed) {
    const result = await verifyQuestion(q, subject);

    if (!result.valid) {
      console.warn(`DROPPED unverifiable question ("${subject}/${topic}"): ${result.reason || "failed verification"}`);
      continue;
    }

    verified.push({
      ...q,
      // self-heal: if the verifier landed on a different (but still
      // option-matching) answer than the original generation, trust
      // the independent check over the first pass.
      correctAnswer: result.correctOption
    });
  }

  parsed = verified;
}

  return parsed.map(q => ({
    subject,
    topic,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: "medium",
    source: "ai"
  }));
};