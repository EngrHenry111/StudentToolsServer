import TopicPerformance from "../models/topicPerformance.js";

// identity = { userId, username } — userId is used to find/create records
// when the caller is authenticated, so a real account's performance never
// gets mixed in with the anonymous "Guest" bucket used by the free quiz.
const buildQuery = ({ userId, username }) => {
  return userId ? { userId } : { username: username || "Guest" };
};

export const updateTopicPerformance = async (identity, results) => {
  for (const r of results) {
    const { subject, topic, isCorrect } = r;

    const query = { ...buildQuery(identity), subject, topic };

    let record = await TopicPerformance.findOne(query);

    if (!record) {
      record = await TopicPerformance.create({
        userId: identity.userId || null,
        username: identity.username || "Guest",
        subject,
        topic
      });
    }

    record.attempts += 1;

    if (isCorrect) {
      record.correct += 1;
    }

    record.accuracy = (record.correct / record.attempts) * 100;

    await record.save();
  }
};


export const getWeakTopics = async (identity) => {
  const topics = await TopicPerformance.find(buildQuery(identity));

  return topics
    .filter(t => t.accuracy < 50 && t.attempts >= 3)
    .map(t => ({
      subject: t.subject,
      topic: t.topic,
      accuracy: t.accuracy
    }));
};
