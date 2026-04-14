// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ""
  },
  skillCoins: {
    type: Number,
    default: 100 // Starting balance
  },
  skillsToTeach: [
    {
      skillId: mongoose.Schema.Types.ObjectId,
      skillName: String,
      level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Intermediate'
      },
      experience: String,
      verified: Boolean
    }
  ],
  skillsToLearn: [
    {
      skillId: mongoose.Schema.Types.ObjectId,
      skillName: String,
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
      }
    }
  ],
  totalTeachingSessions: {
    type: Number,
    default: 0
  },
  totalLearningSessions: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  totalCoinsEarned: {
    type: Number,
    default: 0
  },
  totalCoinsSpent: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
