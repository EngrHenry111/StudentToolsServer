import OpenAI from "openai";
import TopicPerformance from "../models/topicPerformance.js";
import QuizProgress from "../models/QuizProgress.js";
import { getWeakTopics } from "../services/performanceService.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const OVERALL_TOPIC = "__overall__";

// Generates a short, concrete "today's plan" from the student's actual
// weak/strong topics — one cheap AI call, not a whole new analytics
// system. If this fails for any reason, the rest of the dashboard
// (which is pure database aggregation, no AI) still works fine —
// the plan is additive, never a hard dependency.
const generateTodaysPlan = async (strongTopics, weakTopics) => {
  const prompt = `
A student's quiz performance data:

Strong topics (mastered): ${JSON.stringify(strongTopics.map(t => `${t.subject}/${t.topic}`))}
Weak topics (needs work): ${JSON.stringify(weakTopics.map(t => `${t.subject}/${t.topic} (${Math.round(t.accuracy)}% accuracy)`))}

Write a short, specific study plan for TODAY as a checklist of 4-5 items.
Prioritize the weak topics. Be concrete (e.g. "Review [specific topic] and
attempt 10 practice questions", not generic advice). If there are no weak
topics, suggest maintaining strong areas and trying a new subject.

Respond with ONLY a JSON array of strings, no markdown, no extra text.
Example: ["Review Quadratic Equations and attempt 10 practice questions", "..."]
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "Return ONLY a JSON array of short strings." },
        { role: "user", content: prompt }
      ]
    });

    const raw = completion.choices[0].message.content.replace(/```json|```/g, "").trim();
    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    if (start === -1 || end === -1) return null;

    return JSON.parse(raw.substring(start, end + 1));
  } catch (err) {
    console.error("STUDY PLAN GENERATION ERROR:", err.message);
    return null;
  }
};

export const getStudyCoachOverview = async (req, res) => {
  try {
    const identity = { userId: req.user._id, username: req.user.username };

    const allTopics = await TopicPerformance.find({ userId: req.user._id });

    const overall = await QuizProgress.findOne({
      userId: req.user._id,
      topic: OVERALL_TOPIC
    });

    // Academic Health = overall weighted accuracy across every topic
    // attempted at least once — deliberately simple, transparent maths,
    // not a black-box score. Matches the project's own instruction not
    // to overclaim what the AI can determine.
    const totalAttempts = allTopics.reduce((sum, t) => sum + t.attempts, 0);
    const totalCorrect = allTopics.reduce((sum, t) => sum + t.correct, 0);
    const academicHealth = totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : null;

    const strongTopics = allTopics
      .filter((t) => t.accuracy >= 70 && t.attempts >= 3)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 5)
      .map((t) => ({ subject: t.subject, topic: t.topic, accuracy: Math.round(t.accuracy) }));

    const weakTopics = (await getWeakTopics(identity))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5)
      .map((t) => ({ ...t, accuracy: Math.round(t.accuracy) }));

    let todaysPlan = null;
    if (strongTopics.length > 0 || weakTopics.length > 0) {
      todaysPlan = await generateTodaysPlan(strongTopics, weakTopics);
    }

    res.json({
      academicHealth,
      streak: overall?.streak || 0,
      xp: overall?.xp || 0,
      level: overall?.level || 1,
      strongTopics,
      weakTopics,
      todaysPlan: todaysPlan || [
        "Take a quiz in any subject to start building your study plan!"
      ],
      hasEnoughData: totalAttempts > 0
    });

  } catch (err) {
    console.error("STUDY COACH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
