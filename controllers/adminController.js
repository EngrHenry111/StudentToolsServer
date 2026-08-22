import Admin from "../models/adminModel.js";
import Tutorial from "../models/tutorialModel.js";
import Question from "../models/questionModel.js";
import QuizProgress from "../models/QuizProgress.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const OVERALL_TOPIC = "__overall__";

export const adminLogin = async (req,res)=>{

 try{

  const {email,password} = req.body;

  const admin = await Admin.findOne({email});

  if(!admin){
   return res.status(401).json({message:"Invalid credentials"});
  }

  const isMatch = await bcrypt.compare(password,admin.password);

  if(!isMatch){
   return res.status(401).json({message:"Invalid credentials"});
  }

  const token = jwt.sign(
   {id:admin._id},
   process.env.JWT_SECRET,
   {expiresIn:"1d"}
  );

  res.json({token});

 }catch(error){

  res.status(500).json({message:error.message});

 }

};


export const getAdminStats = async (req, res) => {
 try {

  // ✅ TOTAL
  const total = await Tutorial.countDocuments();

  // ✅ SAFE published (fallback if no status field)
  const published = await Tutorial.countDocuments({
   $or: [
    { status: "published" },
    { status: { $exists: false } } // fallback
   ]
  });

  // ✅ SAFE drafts
  const drafts = await Tutorial.countDocuments({
   status: "draft"
  });

  // ✅ SAFE views aggregation
  const tutorials = await Tutorial.find().select("views");

  const views = tutorials.reduce((sum, t) => {
   return sum + (t.views || 0);
  }, 0);

  res.json({
   total,
   published,
   drafts,
   views
  });

 } catch (error) {
  console.error("ADMIN STATS ERROR:", error); // 👈 VERY IMPORTANT

  res.status(500).json({
   message: error.message
  });
 }
};

// =====================================================
// CURATED QUESTIONS (WAEC/JAMB-style bank) — admin management
// =====================================================

export const addCuratedQuestion = async (req, res) => {
  try {
    const { subject, topic, examBody, question, options, correctAnswer, explanation, difficulty, year } = req.body;

    if (!subject || !topic || !question || !Array.isArray(options) || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ message: "subject, topic, question, 4 options, and correctAnswer are required" });
    }

    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ message: "correctAnswer must exactly match one of the 4 options" });
    }

    const saved = await Question.create({
      subject,
      topic,
      examBody: examBody || null,
      year: year || null,
      question,
      options,
      correctAnswer,
      explanation: explanation || "",
      difficulty: difficulty || "medium",
      source: "curated"
    });

    res.status(201).json(saved);

  } catch (error) {
    console.error("ADD CURATED QUESTION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const listCuratedQuestions = async (req, res) => {
  try {
    const { subject, examBody } = req.query;

    const query = { source: "curated" };
    if (subject) query.subject = subject;
    if (examBody) query.examBody = examBody;

    const questions = await Question.find(query).sort({ createdAt: -1 });
    res.json(questions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCuratedQuestion = async (req, res) => {
  try {
    const deleted = await Question.findOneAndDelete({ _id: req.params.id, source: "curated" });

    if (!deleted) {
      return res.status(404).json({ message: "Curated question not found" });
    }

    res.json({ message: "Deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================================
// FULL DASHBOARD STATS (free quiz + Pro quiz + curated questions)
// =====================================================

export const getFullDashboardStats = async (req, res) => {
  try {

    // ---------- FREE PRACTICE QUIZ ----------
    // Free quiz progress docs never use the OVERALL_TOPIC sentinel —
    // that's reserved for authenticated Pro users' aggregate record.
    const freeQuizDocs = await QuizProgress.find({
      topic: { $ne: OVERALL_TOPIC },
      userId: null
    });

    const freeQuiz = {
      totalAttempts: freeQuizDocs.reduce((sum, d) => sum + (d.attempts || 0), 0),
      totalCorrect: freeQuizDocs.reduce((sum, d) => sum + (d.correct || 0), 0),
      uniquePlayers: new Set(freeQuizDocs.map(d => d.username)).size
    };

    // ---------- PRO QUIZ ----------
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });

    const proProgressDocs = await QuizProgress.find({ topic: OVERALL_TOPIC });

    const proQuiz = {
      totalUsers,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
      totalXP: proProgressDocs.reduce((sum, d) => sum + (d.xp || 0), 0),
      totalAttempts: proProgressDocs.reduce((sum, d) => sum + (d.attempts || 0), 0),
      totalCorrect: proProgressDocs.reduce((sum, d) => sum + (d.correct || 0), 0),
      aiGeneratedQuestions: await Question.countDocuments({ source: "ai" })
    };

    // ---------- CURATED QUESTIONS (WAEC/JAMB bank) ----------
    const curatedTotal = await Question.countDocuments({ source: "curated" });

    const bySubjectAgg = await Question.aggregate([
      { $match: { source: "curated" } },
      { $group: { _id: "$subject", count: { $sum: 1 } } }
    ]);

    const byExamBodyAgg = await Question.aggregate([
      { $match: { source: "curated" } },
      { $group: { _id: "$examBody", count: { $sum: 1 } } }
    ]);

    const curatedQuestions = {
      total: curatedTotal,
      bySubject: Object.fromEntries(bySubjectAgg.map(s => [s._id || "unknown", s.count])),
      byExamBody: Object.fromEntries(byExamBodyAgg.map(s => [s._id || "unspecified", s.count]))
    };

    res.json({ freeQuiz, proQuiz, curatedQuestions });

  } catch (error) {
    console.error("FULL DASHBOARD STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};