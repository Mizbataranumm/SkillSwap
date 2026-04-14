// models/SkillMatcher.js
const mongoose = require('mongoose');

const skillMatcherSchema = new mongoose.Schema({
  matchId: {
    type: String,
    unique: true,
    required: true
  },
  learner: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    skillsToLearn: [String]
  },
  suggestedTeachers: [
    {
      teacherId: mongoose.Schema.Types.ObjectId,
      teacherName: String,
      matchingSkills: [String],
      matchScore: {
        type: Number,
        min: 0,
        max: 100
      },
      teacherRating: Number,
      sessionsSuggested: Number
    }
  ],
  matchAlgorithm: {
    type: String,
    enum: ['Similarity', 'Rating', 'Availability', 'Hybrid'],
    default: 'Hybrid'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});

module.exports = mongoose.model('SkillMatcher', skillMatcherSchema);
