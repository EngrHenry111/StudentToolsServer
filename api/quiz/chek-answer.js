export const checkAnswer = async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;

    const question = await Question.findById(questionId);

    const isCorrect = question.correctAnswer === selectedAnswer;

    res.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });

  } catch (err) {
    res.status(500).json({ message: "Error checking answer" });
  }
};