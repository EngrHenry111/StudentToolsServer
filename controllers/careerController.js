import OpenAI from "openai";
import CareerProfile from "../models/CareerProfile.js";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

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

const generateRoadmap = async ({ careerGoal, currentSkills, interests }) => {
  const prompt = `
A student wants to become a: ${careerGoal}

Their current skills: ${currentSkills.length ? currentSkills.join(", ") : "none listed yet"}
Their interests: ${interests.length ? interests.join(", ") : "none listed"}

Generate a realistic, ORDERED career roadmap for them — a sequence of
skills/milestones from where they likely are now to that career goal
(e.g. for "Machine Learning Engineer": Python -> Data Analysis ->
Statistics -> Machine Learning -> Deep Learning -> Portfolio -> Internship
-> Junior ML Engineer). Tailor the starting point to their existing skills
— skip steps they've already covered.

Also suggest:
- 5 specific skills they should focus on learning next
- 3 concrete project ideas that would build their portfolio toward this goal

Respond with ONLY this JSON (no markdown):
{
  "steps": ["step 1", "step 2", "..."],
  "recommendedSkills": ["...", "..."],
  "recommendedProjects": ["...", "..."]
}
`;

  const raw = (await callAI([
    { role: "system", content: "Return ONLY valid JSON. Be realistic and specific, not generic." },
    { role: "user", content: prompt }
  ])).replace(/```json|```/g, "").trim();

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI did not return a valid roadmap");
  }

  return JSON.parse(raw.substring(start, end + 1));
};

export const saveCareerProfile = async (req, res) => {
  try {
    const { careerGoal, currentSkills, interests } = req.body;

    if (!careerGoal || !careerGoal.trim()) {
      return res.status(400).json({ message: "Career goal is required" });
    }

    const cleanSkills = Array.isArray(currentSkills)
      ? currentSkills.map((s) => s.trim()).filter(Boolean)
      : [];
    const cleanInterests = Array.isArray(interests)
      ? interests.map((i) => i.trim()).filter(Boolean)
      : [];

    let profile = await CareerProfile.findOne({ user: req.user._id });

    let roadmap;
    try {
      roadmap = await generateRoadmap({
        careerGoal: careerGoal.trim(),
        currentSkills: cleanSkills,
        interests: cleanInterests
      });
    } catch (aiErr) {
      console.error("ROADMAP GENERATION ERROR:", aiErr.message);
      return res.status(500).json({ message: "Couldn't generate your roadmap right now. Please try again." });
    }

    if (!profile) {
      profile = new CareerProfile({ user: req.user._id });
    }

    profile.careerGoal = careerGoal.trim();
    profile.currentSkills = cleanSkills;
    profile.interests = cleanInterests;
    profile.roadmap = { ...roadmap, generatedAt: new Date() };

    await profile.save();

    res.json(profile);

  } catch (err) {
    console.error("SAVE CAREER PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getCareerProfile = async (req, res) => {
  try {
    const profile = await CareerProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: "No career profile set up yet" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
