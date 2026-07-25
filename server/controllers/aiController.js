// Smart AI Tutor assistant endpoint
exports.askAITutor = async (req, res) => {
  try {
    const { question, courseTitle, lessonTitle } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question prompt is required' });
    }

    const q = question.toLowerCase();
    let answer = "";

    if (q.includes('react') || q.includes('component') || q.includes('hooks') || q.includes('state')) {
      answer = "In React, state represents data that changes over time within a component. Hooks like `useState` allow function components to declare local state, while `useEffect` manages side-effects such as data fetching or subscriptions.";
    } else if (q.includes('quiz') || q.includes('score') || q.includes('pass')) {
      answer = "Quizzes evaluate your understanding after each module! You can retake quizzes anytime to improve your score. Achieving >60% unlocks the next milestone!";
    } else if (q.includes('certificate') || q.includes('download')) {
      answer = "Certificates are generated automatically once you complete 100% of all lessons and pass all module quizzes. You can download your official PDF directly from the course page or your Profile dashboard!";
    } else if (q.includes('video') || q.includes('progress') || q.includes('speed')) {
      answer = "Our video player tracks your watch position automatically. When you watch more than 90% of a lesson, it will be marked complete!";
    } else if (q.includes('node') || q.includes('express') || q.includes('jwt') || q.includes('api')) {
      answer = "Express is a fast, minimal Node.js web framework. JWT (JSON Web Tokens) are used to securely transmit information between client and server for authenticated user sessions.";
    } else {
      answer = `Great question regarding "${lessonTitle || courseTitle || 'this course'}"! Here is a tip: focus on applying concepts with practical hands-on projects, reviewing lesson notes, and testing yourself with the end-of-module quizzes. Feel free to ask more specific questions!`;
    }

    // Add brief latency simulation to feel like AI processing
    setTimeout(() => {
      res.json({
        question,
        answer,
        suggestedTopics: [
          'How to earn XP & Badges',
          'Where to download lesson resources',
          'Course completion requirements'
        ]
      });
    }, 400);
  } catch (error) {
    res.status(500).json({ message: 'Error processing AI query' });
  }
};
