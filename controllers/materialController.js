import Material from "../models/Material.js";
import Question from "../models/questionModel.js";
import { extractTextFromFile, validateExtractedText } from "../services/documentExtractor.js";
import { generateMaterialQuiz, verifyMaterialQuestion } from "../services/materialQuizGenerator.js";

// Upload a file OR paste text directly, extract it, generate a
// multi-format quiz strictly from that content, and save it — all in
// one request. No background job queue for v1 (deliberately deferred,
// see the project plan) — Groq is fast enough that this completes
// within a normal request/response cycle for realistically-sized
// course material.
export const uploadMaterial = async (req, res) => {
  try {
    const { title, pastedText, subject, courseCode, questionCount } = req.body;
    const file = req.file;

    if (!file && !pastedText) {
      return res.status(400).json({ message: "Please upload a file or paste your notes" });
    }

    let text, sourceType;

    if (file) {
      const extracted = await extractTextFromFile(file.buffer, file.mimetype, file.originalname);
      text = extracted.text;
      sourceType = extracted.sourceType;
    } else {
      text = pastedText;
      sourceType = "text";
    }

    const validation = validateExtractedText(text);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const material = await Material.create({
      user: req.user._id,
      title: title || file?.originalname || "Untitled material",
      sourceType,
      extractedText: text,
      subject: subject || null,
      courseCode: courseCode || null,
      status: "processing"
    });

    try {
      const requestedCount = Math.min(Number(questionCount) || 10, 20);
      const generated = await generateMaterialQuiz({ text, questionCount: requestedCount });

      if (generated.length === 0) {
        material.status = "failed";
        material.errorMessage = "Could not generate any valid questions from this material.";
        await material.save();
        return res.status(422).json({ message: material.errorMessage });
      }

      // Independent verification pass — same "second, skeptical opinion"
      // pattern used elsewhere, checking each question against the
      // ORIGINAL material specifically (catches the AI drifting away
      // from what was actually uploaded).
      const verified = [];
      for (const q of generated) {
        const check = await verifyMaterialQuestion(q, text);
        if (check.valid) verified.push(q);
      }

      if (verified.length === 0) {
        material.status = "failed";
        material.errorMessage = "Generated questions failed verification against the material.";
        await material.save();
        return res.status(422).json({ message: material.errorMessage });
      }

      const savedQuestions = await Question.insertMany(
        verified.map((q) => ({
          subject: subject || "material",
          topic: q.conceptTag,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: "medium",
          source: "material",
          materialId: material._id,
          questionFormat: q.format,
          conceptTag: q.conceptTag
        }))
      );

      material.status = "ready";
      await material.save();

      res.status(201).json({
        material: {
          id: material._id,
          title: material.title,
          status: material.status,
          questionCount: savedQuestions.length
        }
      });

    } catch (genErr) {
      console.error("MATERIAL QUIZ GENERATION ERROR:", genErr);
      material.status = "failed";
      material.errorMessage = "Something went wrong generating your quiz. Please try again.";
      await material.save();
      return res.status(500).json({ message: material.errorMessage });
    }

  } catch (err) {
    console.error("UPLOAD MATERIAL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// List the current user's uploaded materials
export const listMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ user: req.user._id })
      .select("-extractedText") // don't ship the full document text back down
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get the generated quiz questions for a specific material — ownership
// enforced so one student can never pull another student's uploaded
// material or the quiz generated from it.
export const getMaterialQuiz = async (req, res) => {
  try {
    const material = await Material.findOne({ _id: req.params.id, user: req.user._id });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.status !== "ready") {
      return res.status(400).json({ message: `Material is ${material.status}, not ready yet` });
    }

    const questions = await Question.find({ materialId: material._id });

    const safe = questions.map((q) => ({
      id: q._id,
      question: q.question,
      options: q.options,
      format: q.questionFormat,
      conceptTag: q.conceptTag
    }));

    res.json({ material: { id: material._id, title: material.title }, questions: safe });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    await Question.deleteMany({ materialId: material._id });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
