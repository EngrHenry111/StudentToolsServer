import OpenAI from "openai";
import Question from "../models/questionModel.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const generateAIQuestions = async ({ subject, topic, count }) => {

  const prompt = `
Generate ${count} WAEC-style multiple-choice questions on ${topic} in ${subject}.

Return STRICT JSON:
[
 {
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "...",
  "explanation": "..."
 }
]
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });

  const raw = completion.choices[0].message.content;

  let parsed = [];

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Invalid AI JSON response");
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


