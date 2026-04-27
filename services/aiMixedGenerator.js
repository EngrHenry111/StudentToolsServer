// FILE: /services/aiMixedGenerator.js

import OpenAI from "openai";
import { topicBank } from "./topicBank.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export const generateMixedQuiz = async (limit = 10) => {

  const prompt = `
You are an expert WAEC and JAMB examiner.

Generate ${limit} multiple-choice questions.

Rules:
- Mix Physics, Mathematics, and Chemistry
- Use WAEC/JAMB standard difficulty
- Each question must have:
  - subject
  - topic
  - question
  - 4 options
  - correctAnswer
  - explanation

STRICT JSON FORMAT ONLY:
[
  {
    "subject": "",
    "topic": "",
    "question": "",
    "options": ["A","B","C","D"],
    "correctAnswer": "",
    "explanation": ""
  }
]

Topics must be selected from:
Physics: ${topicBank.physics.join(", ")}
Mathematics: ${topicBank.mathematics.join(", ")}
Chemistry: ${topicBank.chemistry.join(", ")}
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(res.choices[0].message.content);
};