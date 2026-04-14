// models/CoinTransaction.js
const mongoose = require('mongoose');

const coinTransactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  from: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    role: {
      type: String,
      enum: ['Learner', 'Teacher'],
      required: true
    }
  },
  to: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    role: {
      type: String,
      enum: ['Learner', 'Teacher'],
      required: true
    }
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['Learning', 'Teaching', 'Bonus', 'Penalty', 'Refund'],
    required: true
  },
  sessionId: mongoose.Schema.Types.ObjectId, // Reference to learning session
  skill: String,
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
