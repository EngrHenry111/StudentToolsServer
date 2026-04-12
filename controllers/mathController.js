import MathHistory from "../models/MathHistory.js";

export const solveMath = async (req, res, next) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      res.status(400);
      throw new Error("Problem is required");
    }

    const result = solveMathProblem(problem);

    if (result.error) {
      res.status(400);
      throw new Error(result.error);
    }

    // 🔥 Save history (non-blocking)
    await MathHistory.create({
      problem,
      topic: result.topic,
      answer: result.answer,
      steps: result.steps,
    });

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};