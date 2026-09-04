import OpenAI from "openai";
import CourseConversation from "../models/CourseConversation.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

const SYSTEM_PROMPT = `
You are an AI Course Tutor helping a university student understand their
coursework. You will be told which course (and sometimes which specific
topic) the student is asking about — tailor your explanation to that
context rather than answering generically.

Formatting rules:
- Use Markdown formatting
- Use headings for titles, with a blank line after each heading
- Use bullet points for lists
- Use code blocks for programming examples
- Keep answers clean, well-structured, and genuinely educational —
  explain the reasoning, not just the final answer
`;

// Continues (or starts) a conversation. Same retry-on-transient-failure
// pattern used elsewhere in the app, since a student mid-study-session
// shouldn't lose their question to a momentary network blip.
const callAI = async (messages, retries = 2) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages
    });
    return completion.choices[0].message.content;
  } catch (err) {
    if (retries > 0) return callAI(messages, retries - 1);
    throw err;
  }
};

export const askCourseTutor = async (req, res) => {
  try {
    const { conversationId, courseName, topic, question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    let conversation;

    if (conversationId) {
      conversation = await CourseConversation.findOne({ _id: conversationId, user: req.user._id });
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } else {
      if (!courseName || !courseName.trim()) {
        return res.status(400).json({ message: "Course name is required to start a new conversation" });
      }
      conversation = await CourseConversation.create({
        user: req.user._id,
        courseName: courseName.trim(),
        topic: topic?.trim() || null,
        messages: []
      });
    }

    conversation.messages.push({ role: "user", content: question.trim() });

    // Build the full message history for context, capped to the most
    // recent exchanges so long-running conversations don't blow past
    // the model's context window or slow things down unnecessarily.
    const contextMessages = [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}\n\nCourse: ${conversation.courseName}${conversation.topic ? `\nTopic: ${conversation.topic}` : ""}`
      },
      ...conversation.messages.slice(-16).map((m) => ({ role: m.role, content: m.content }))
    ];

    const answer = await callAI(contextMessages);

    conversation.messages.push({ role: "assistant", content: answer });
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      courseName: conversation.courseName,
      topic: conversation.topic,
      answer
    });

  } catch (err) {
    console.error("COURSE TUTOR ERROR:", err);
    res.status(500).json({ message: "The tutor couldn't respond right now. Please try again." });
  }
};

export const listConversations = async (req, res) => {
  try {
    const conversations = await CourseConversation.find({ user: req.user._id })
      .select("courseName topic updatedAt messages")
      .sort({ updatedAt: -1 });

    // return a lightweight preview (last message) rather than full history
    // for the list view — full detail loads only when one is opened
    const preview = conversations.map((c) => ({
      id: c._id,
      courseName: c.courseName,
      topic: c.topic,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
      lastMessage: c.messages[c.messages.length - 1]?.content?.slice(0, 100) || ""
    }));

    res.json(preview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await CourseConversation.findOne({ _id: req.params.id, user: req.user._id });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const deleted = await CourseConversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
