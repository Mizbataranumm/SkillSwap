// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  login: (email, password) =>
    api.post('/auth/login', { email, password })
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addSkillToTeach: (skillName, level, experience) =>
    api.post('/users/skills-to-teach', { skillName, level, experience }),
  addSkillToLearn: (skillName, priority) =>
    api.post('/users/skills-to-learn', { skillName, priority }),
  getUser: (userId) => api.get(`/users/${userId}`),
  getAllUsers: (skill, limit) =>
    api.get('/users', { params: { skill, limit } })
};

// Skills APIs
export const skillsAPI = {
  searchTeachers: (skillName) => api.get(`/skills/teachers/${skillName}`),
  searchLearners: (skillName) => api.get(`/skills/learners/${skillName}`),
  getAllSkills: () => api.get('/skills')
};

// Sessions APIs
export const sessionsAPI = {
  requestSession: (teacherId, skillName, duration, skillCoinsOffered, description) =>
    api.post('/sessions/request', {
      teacherId,
      skillName,
      duration,
      skillCoinsOffered,
      description
    }),
  acceptSession: (sessionId, scheduledTime, meetingLink) =>
    api.put(`/sessions/${sessionId}/accept`, { scheduledTime, meetingLink }),
  completeSession: (sessionId) =>
    api.put(`/sessions/${sessionId}/complete`),
  rateSession: (sessionId, rating, comment, ratedBy) =>
    api.post(`/sessions/${sessionId}/rate`, { rating, comment, ratedBy }),
  getUserSessions: (userId) =>
    api.get(`/sessions/user/${userId}`),
  getPendingSessions: () => api.get('/sessions')
};

// Coins APIs
export const coinsAPI = {
  getBalance: () => api.get('/coins/balance'),
  transferCoins: (sessionId) => api.post('/coins/transfer-session', { sessionId }),
  getTransactionHistory: () => api.get('/coins/history'),
  getLeaderboard: () => api.get('/coins/leaderboard/teachers')
};

// Matcher APIs
export const matcherAPI = {
  findTeachers: () => api.post('/matcher/find-teachers'),
  findLearners: () => api.post('/matcher/find-learners'),
  getMatches: () => api.get('/matcher')
};

export default api;
