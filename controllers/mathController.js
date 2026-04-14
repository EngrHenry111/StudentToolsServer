import MathHistory from "../models/MathHistory.js";
import { solveMathProblem } from "../services/index.js";

export const solveMath = async (req, res, next) => {
  try {
    const { problem } = req.body;

    console.log("📥 Incoming problem:", problem);

    if (!problem) {
      return res.status(400).json({ message: "Problem is required" });
    }

    const result = solveMathProblem(problem);

    console.log("🧠 Engine result:", result);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    MathHistory.create({
      problem,
      topic: result.topic,
      answer: result.answer,
      steps: result.steps,
    }).catch(console.error);

    res.status(200).json(result);

  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    next(error);
  }
};