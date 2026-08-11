import { getWeakTopics } from "./performanceService.js";
import { getOrGenerateQuestions } from "./aiQuestionServices.js";
import { topicBank } from "./topicBank.js";

// identity = { userId, username }
export const generateAdaptiveQuiz = async ({ identity, limit = 10 }) => {

  const weakTopics = await getWeakTopics(identity);

  const questions = [];
  const subjects = Object.keys(topicBank);

  for (let i = 0; i < limit; i++) {

    let subject, topic;

    // prioritize weak topics for the first half of the quiz
    if (weakTopics.length > 0 && i < Math.ceil(limit / 2)) {
      const weak = weakTopics[Math.floor(Math.random() * weakTopics.length)];
      subject = weak.subject;
      topic = weak.topic;
    } else {
      subject = subjects[Math.floor(Math.random() * subjects.length)];
      const topics = topicBank[subject];
      topic = topics[Math.floor(Math.random() * topics.length)];
    }

    const q = await getOrGenerateQuestions({ subject, topic, limit: 1 });

    if (q && q[0]) {
      questions.push(q[0]);
    }
  }

  return questions;
};
