import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const generateAIQuestions = async ({ subject, topic, count }) => {

  const prompt = `
You are an expert WAEC/JAMB physics examiner.

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
- ONLY one correct answer
- Wrong options must look realistic
- Avoid options like:
  "We can use formula..."
  "Cannot be determined"
  "Depends on..."
  unless absolutely necessary

Each question object must contain:
- question
- options
- correctAnswer
- explanation

FORMAT:

[
  {
    "question": "What is friction?",
    "options": [
      "A. A resisting force",
      "B. A magnetic force",
      "C. An electric force",
      "D. A nuclear force"
    ],
    "correctAnswer": "A. A resisting force",
    "explanation": "Friction opposes motion between surfaces."
  }
]
`;

  // 🔁 RETRY FUNCTION
  const callAI = async (retries = 2) => {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
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
parsed = parsed.filter(q => {
  return (
    q.question &&
    Array.isArray(q.options) &&
    q.options.length === 4 &&
    q.correctAnswer &&
    q.explanation &&
    q.options.every(opt => opt.length > 5)
  );
});

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