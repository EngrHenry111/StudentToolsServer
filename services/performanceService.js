import TopicPerformance from "../models/topicPerformance.js";

export const updateTopicPerformance = async (username, results) => {

  for (const r of results) {

    const { subject, topic, isCorrect } = r;

    let record = await TopicPerformance.findOne({ username, subject, topic });

    if (!record) {
      record = await TopicPerformance.create({ username, subject, topic });
    }

    record.attempts += 1;

    if (isCorrect) {
      record.correct += 1;
    }

    record.accuracy = (record.correct / record.attempts) * 100;

    await record.save();
  }
};


export const getWeakTopics = async (username) => {

  const topics = await TopicPerformance.find({ username });

  return topics
    .filter(t => t.accuracy < 50 && t.attempts >= 3)
    .map(t => ({
      subject: t.subject,
      topic: t.topic,
      accuracy: t.accuracy
    }));
};