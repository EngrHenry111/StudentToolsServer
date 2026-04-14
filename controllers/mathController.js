export const solveMath = async (req, res, next) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({ message: "Problem is required" });
    }

    const result = solveMathProblem(problem);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // Save history (non-blocking)
    MathHistory.create({
      problem,
      topic: result.topic,
      answer: result.answer,
      steps: result.steps,
    }).catch(console.error);

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};