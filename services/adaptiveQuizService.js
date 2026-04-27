import { getWeakTopics } from "./performanceService.js";
import { getOrGenerateQuestions } from "./aiQuestionServices.js";

export const generateAdaptiveQuiz = async ({ username, limit = 10 }) => {

  // 1. Get weak topics
  const weakTopics = await getWeakTopics(username);

  // 2. If no weak topics → fallback
  if (!weakTopics.length) {
    return await getOrGenerateQuestions({
      subject: "Physics",
      topic: "Newton's Laws",
      limit
    });
  }

  // 3. Distribute questions across weak topics
  const totalWeak = weakTopics.length;

// Allow more per subject
const basePerTopic = Math.floor(limit / totalWeak);

let questions = [];

for (const t of weakTopics) {

  // 🔥 give weaker topics MORE weight
  let extra = 0;

  if (t.accuracy < 30) extra = 2;
  else if (t.accuracy < 50) extra = 1;

  const finalCount = basePerTopic + extra;

  const q = await getOrGenerateQuestions({
    subject: t.subject,
    topic: t.topic,
    limit: finalCount
  });

  questions.push(...q);
}

// trim to exact limit
return questions.slice(0, limit);
};