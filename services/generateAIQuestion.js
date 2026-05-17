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
- Questions must match WAEC/JAMB standard
- Include calculation and theory questions
- Physics calculations must use correct formulas
- Chemistry equations must be scientifically correct
- Mathematics questions must be solvable
- Options must be FULL TEXT
- Never return only A/B/C/D
- Wrong options must still look realistic
- Only ONE correct answer
- Explanations must be educational
- Output ONLY valid JSON

Each question must include:
- question
- 4 COMPLETE options
- correctAnswer
- explanation

IMPORTANT:
- Every option must contain FULL TEXT
- Never return only "A", "B", "C", "D"
- Format options exactly like:

"options": [
  "A. Newton's First Law",
  "B. Newton's Second Law",
  "C. Newton's Third Law",
  "D. Law of Gravitation"
]
  
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