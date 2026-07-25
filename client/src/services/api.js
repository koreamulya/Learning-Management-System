const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('lms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Courses
  async getCourses(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${BASE_URL}/courses?${query}`);
    return res.json();
  },

  async getCourse(id) {
    const res = await fetch(`${BASE_URL}/courses/${id}`);
    return res.json();
  },

  async createCourse(data) {
    const res = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCourse(id, data) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCourse(id) {
    const res = await fetch(`${BASE_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Progress
  async enrollCourse(courseId) {
    const res = await fetch(`${BASE_URL}/progress/enroll`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ courseId })
    });
    return res.json();
  },

  async getProgress(courseId) {
    const res = await fetch(`${BASE_URL}/progress/${courseId}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  async updateProgress(data) {
    const res = await fetch(`${BASE_URL}/progress/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Quiz
  async submitQuiz(data) {
    const res = await fetch(`${BASE_URL}/quizzes/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Reviews
  async getReviews(courseId) {
    const res = await fetch(`${BASE_URL}/reviews/${courseId}`);
    return res.json();
  },

  async addReview(courseId, data) {
    const res = await fetch(`${BASE_URL}/reviews/${courseId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteReview(id) {
    const res = await fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // AI Assistant
  async askAI(data) {
    const res = await fetch(`${BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Discussions & Leaderboard
  async getDiscussions(courseId) {
    const res = await fetch(`${BASE_URL}/discussions/${courseId}`);
    return res.json();
  },

  async createDiscussion(courseId, data) {
    const res = await fetch(`${BASE_URL}/discussions/${courseId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async replyDiscussion(id, data) {
    const res = await fetch(`${BASE_URL}/discussions/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getLeaderboard() {
    const res = await fetch(`${BASE_URL}/discussions/leaderboard`);
    return res.json();
  }
};
