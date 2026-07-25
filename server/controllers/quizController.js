const { stores } = require('../config/db');

// Evaluate quiz answers automatically
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, quizId, userAnswers } = req.body;
    const userId = req.user._id;

    const course = stores.Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Locate quiz from course modules
    let foundQuiz = null;
    if (course.modules) {
      for (const m of course.modules) {
        if (m.quiz && m.quiz.id === quizId) {
          foundQuiz = m.quiz;
          break;
        }
      }
    }

    if (!foundQuiz) {
      return res.status(404).json({ message: 'Quiz not found in course' });
    }

    let correctCount = 0;
    const totalQuestions = foundQuiz.questions.length;
    const results = [];

    foundQuiz.questions.forEach((q, idx) => {
      const userAnswer = userAnswers[q.id || idx];
      let isCorrect = false;

      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        isCorrect = String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      } else if (q.type === 'fill-blank') {
        isCorrect = String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
      }

      if (isCorrect) correctCount++;
      results.push({
        questionId: q.id || idx,
        questionText: q.question,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || ''
      });
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercentage >= (foundQuiz.passingScore || 60);

    // Reward XP for passing quiz
    let xpEarned = 0;
    if (passed) {
      xpEarned = 50 + Math.round(scorePercentage * 0.5);
      const user = stores.User.findById(userId);
      if (user) {
        stores.User.findByIdAndUpdate(userId, { xp: (user.xp || 0) + xpEarned });
      }
    }

    // Record quiz score in user progress
    let progress = stores.Progress.findOne({ userId, courseId });
    if (progress) {
      const quizScores = { ...(progress.quizScores || {}), [quizId]: scorePercentage };
      stores.Progress.findByIdAndUpdate(progress._id, { quizScores });
    }

    res.json({
      score: scorePercentage,
      correctCount,
      totalQuestions,
      passed,
      xpEarned,
      results
    });
  } catch (error) {
    console.error('Quiz evaluation error:', error);
    res.status(500).json({ message: 'Server error evaluating quiz' });
  }
};
