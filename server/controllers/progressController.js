const { stores } = require('../config/db');

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    const course = stores.Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let progress = stores.Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = stores.Progress.insertOne({
        userId,
        courseId,
        completedLessons: [],
        videoTimestamps: {},
        quizScores: {},
        completionPercentage: 0,
        isCompleted: false,
        enrolledAt: new Date().toISOString()
      });

      // Update student enrollment list & course count
      const user = stores.User.findById(userId);
      if (user && (!user.enrolledCourses || !user.enrolledCourses.includes(courseId))) {
        const enrolled = user.enrolledCourses || [];
        stores.User.findByIdAndUpdate(userId, { enrolledCourses: [...enrolled, courseId] });
      }

      stores.Course.findByIdAndUpdate(courseId, { totalStudents: (course.totalStudents || 0) + 1 });
    }

    res.json({ message: 'Enrolled successfully', progress });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

// Get progress for a specific course
exports.getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    let progress = stores.Progress.findOne({ userId, courseId });
    if (!progress) {
      // Auto enroll if not found
      progress = stores.Progress.insertOne({
        userId,
        courseId,
        completedLessons: [],
        videoTimestamps: {},
        quizScores: {},
        completionPercentage: 0,
        isCompleted: false,
        enrolledAt: new Date().toISOString()
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching progress' });
  }
};

// Update lesson watch timestamp or completion status
exports.updateProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId, lessonId, timestamp, completed, quizScore } = req.body;

    let progress = stores.Progress.findOne({ userId, courseId });
    if (!progress) {
      progress = stores.Progress.insertOne({
        userId,
        courseId,
        completedLessons: [],
        videoTimestamps: {},
        quizScores: {},
        completionPercentage: 0,
        isCompleted: false,
        enrolledAt: new Date().toISOString()
      });
    }

    const course = stores.Course.findById(courseId);
    let totalLessonsCount = 0;
    if (course && course.modules) {
      course.modules.forEach(m => {
        if (m.lessons) totalLessonsCount += m.lessons.length;
      });
    }
    if (totalLessonsCount === 0) totalLessonsCount = 1;

    let updatedCompletedLessons = [...(progress.completedLessons || [])];
    if (lessonId && completed && !updatedCompletedLessons.includes(lessonId)) {
      updatedCompletedLessons.push(lessonId);
    }

    const updatedVideoTimestamps = { ...(progress.videoTimestamps || {}) };
    if (lessonId && timestamp !== undefined) {
      updatedVideoTimestamps[lessonId] = timestamp;
    }

    const updatedQuizScores = { ...(progress.quizScores || {}) };
    if (quizScore) {
      updatedQuizScores[quizScore.quizId] = quizScore.score;
    }

    const completionPercentage = Math.min(
      100,
      Math.round((updatedCompletedLessons.length / totalLessonsCount) * 100)
    );
    const isCompleted = completionPercentage === 100;

    // Grant XP if newly completed
    if (isCompleted && !progress.isCompleted) {
      const user = stores.User.findById(userId);
      if (user) {
        const newXP = (user.xp || 0) + 250;
        const badges = [...(user.badges || [])];
        if (!badges.includes('Course Master')) badges.push('Course Master');
        stores.User.findByIdAndUpdate(userId, { xp: newXP, badges });
      }
    }

    const updated = stores.Progress.findByIdAndUpdate(progress._id, {
      completedLessons: updatedCompletedLessons,
      videoTimestamps: updatedVideoTimestamps,
      quizScores: updatedQuizScores,
      completionPercentage,
      isCompleted,
      completedAt: isCompleted ? (progress.completedAt || new Date().toISOString()) : null
    });

    res.json({ message: 'Progress saved', progress: updated });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error updating progress' });
  }
};
