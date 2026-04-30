import { getWeakTopics } from "./performanceService.js";
import { getOrGenerateQuestions } from "./aiQuestionServices.js";
import { topicBank } from "./topicBank.js";

export const generateAdaptiveQuiz = async (username, limit = 10) => {

  const weakTopics = await getWeakTopics(username);

  const questions = [];

  const subjects = Object.keys(topicBank);

  for (let i = 0; i < limit; i++) {

    let subject, topic;

    // 🔥 PRIORITIZE WEAK TOPICS (first half of quiz)
    if (weakTopics.length > 0 && i < Math.ceil(limit / 2)) {

      const weak = weakTopics[Math.floor(Math.random() * weakTopics.length)];

      subject = weak.subject;
      topic = weak.topic;

    } else {

      // ✅ NORMAL RANDOM GENERATION
      subject = subjects[Math.floor(Math.random() * subjects.length)];
      const topics = topicBank[subject];
      topic = topics[Math.floor(Math.random() * topics.length)];
    }

    const q = await getOrGenerateQuestions({
      subject,
      topic,
      limit: 1
    });

    questions.push(q[0]);
  }

  return questions;
};


// import { getWeakTopics } from "./performanceService.js";
// import { getOrGenerateQuestions } from "./aiQuestionServices.js";

// export const generateAdaptiveQuiz = async ({ username, limit = 10 }) => {

//   // 1. Get weak topics
//   const weakTopics = await getWeakTopics(username);

//   // 2. If no weak topics → fallback
//   if (!weakTopics.length) {
//     return await getOrGenerateQuestions({
//       subject: "Physics",
//       topic: "Newton's Laws",
//       limit
//     });
//   }

//   // 3. Distribute questions across weak topics
//   const totalWeak = weakTopics.length;

// // Allow more per subject
// const basePerTopic = Math.floor(limit / totalWeak);

// let questions = [];

// for (const t of weakTopics) {

//   // 🔥 give weaker topics MORE weight
//   let extra = 0;

//   if (t.accuracy < 30) extra = 2;
//   else if (t.accuracy < 50) extra = 1;

//   const finalCount = basePerTopic + extra;

//   const q = await getOrGenerateQuestions({
//     subject: t.subject,
//     topic: t.topic,
//     limit: finalCount
//   });

//   questions.push(...q);
// }

// // trim to exact limit
// return questions.slice(0, limit);
// };