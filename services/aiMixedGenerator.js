import { topicBank } from "./topicBank.js";
import { getOrGenerateQuestions } from "./aiQuestionServices.js";

export const generateMixedQuiz = async (limit = 10) => {

  const subjects = Object.keys(topicBank);
  const questions = [];

  for (let i = 0; i < limit; i++) {

    // 🎯 Pick subject (balanced)
    const subject = subjects[i % subjects.length];

    // 🎯 Pick topic from that subject
    const topics = topicBank[subject];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // 🎯 Get question (from DB or AI)
    const q = await getOrGenerateQuestions({
      subject,
      topic,
      limit: 1
    });

    questions.push(q[0]);
  }

  return questions;
};