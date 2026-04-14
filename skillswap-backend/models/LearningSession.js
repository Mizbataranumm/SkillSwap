// models/LearningSession.js
const mongoose = require('mongoose');

const learningSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  teacher: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    rating: Number
  },
  learner: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String
  },
  skill: {
    skillName: String,
    skillLevel: String
  },
  skillCoinsValue: {
    type: Number,
    required: true // How many coins for this session
  },
  status: {
    type: String,
    enum: ['Requested', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Requested'
  },
  sessionDate: Date,
  duration: {
    type: Number, // in minutes
    default: 30
  },
  scheduledTime: String,
  description: String,
  meetingLink: String, // Video call link (Zoom, Google Meet, etc.)
  feedback: {
    fromTeacher: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    },
    fromLearner: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      ratedAt: Date
    }
  },
  coinsTransfered: {
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

module.exports = mongoose.model('LearningSession', learningSessionSchema);
