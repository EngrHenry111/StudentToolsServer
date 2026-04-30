export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    // answers = [{ questionId, selectedAnswer }]

    let score = 0;
    const results = [];

    for (let item of answers) {
      const question = await Question.findById(item.questionId);

      const isCorrect = question.correctAnswer === item.selectedAnswer;

      if (isCorrect) score++;

      results.push({
        questionId: item.questionId,
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation
      });
    }

    res.json({
      score,
      total: answers.length,
      results
    });

  } catch (err) {
    res.status(500).json({ message: "Submit failed" });
  }
};