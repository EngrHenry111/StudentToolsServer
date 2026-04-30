import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const generateAIQuestions = async ({ subject, topic, count }) => {

  const prompt = `
You are a WAEC/JAMB exam setter.

Generate ${count} high-quality multiple-choice questions on "${topic}" in ${subject}.

STRICT RULES:
- Output ONLY valid JSON
- DO NOT include markdown (no \`\`\`)
- DO NOT include explanations outside JSON
- DO NOT include comments
- DO NOT include trailing commas
- Ensure JSON is perfectly parsable

Each question must include:
- question
- options (A-D)
- correctAnswer
- explanation

FORMAT:

[
  {
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A. ...",
    "explanation": "..."
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