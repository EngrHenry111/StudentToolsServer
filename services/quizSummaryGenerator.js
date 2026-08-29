import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// Generates a real synthesized recap after a quiz — not just the raw
// right/wrong list the Result screen already shows for free, but an
// actual "here's what this quiz covered, here's what to go back and
// review" summary written as prose, the way a tutor would debrief a
// student after a practice test.
export const generateQuizSummary = async (results) => {
  const correct = results.filter((r) => r.isCorrect).map((r) => r.conceptTag || r.question);
  const incorrect = results.filter((r) => !r.isCorrect).map((r) => r.conceptTag || r.question);

  const prompt = `
A student just finished a practice quiz generated from their own course
material. Here's how they did:

Concepts they got RIGHT: ${JSON.stringify(correct)}
Concepts they got WRONG: ${JSON.stringify(incorrect)}

Write a short, encouraging but honest study recap (3-5 sentences) for the
student. Mention what they've clearly understood, and specifically name
which concepts they should go back and review before their exam. Write
directly to the student ("you"), in plain prose — no headers, no bullet
lists, no markdown.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Write a short, warm, direct study recap. Plain prose only." },
        { role: "user", content: prompt }
      ]
    });

    return completion.choices[0].message.content.trim();

  } catch (err) {
    console.error("QUIZ SUMMARY ERROR:", err.message);
    // Non-fatal — the quiz result itself is already complete without
    // this; a missing summary shouldn't ever block showing results.
    return null;
  }
};
