// routes/coins.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CoinTransaction = require('../models/CoinTransaction');
const LearningSession = require('../models/LearningSession');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Get user's coin balance
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      skillCoins: user.skillCoins,
      totalEarned: user.totalCoinsEarned,
      totalSpent: user.totalCoinsSpent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching balance', error: error.message });
  }
});

// Complete a learning session and transfer coins
router.post('/transfer-session', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await LearningSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.coinsTransfered) {
      return res.status(400).json({ message: 'Coins already transferred for this session' });
    }

    // Deduct coins from learner
    const learner = await User.findById(session.learner.userId);
    if (learner.skillCoins < session.skillCoinsValue) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }

    learner.skillCoins -= session.skillCoinsValue;
    learner.totalCoinsSpent += session.skillCoinsValue;
    learner.totalLearningSessions += 1;
    await learner.save();

    // Add coins to teacher
    const teacher = await User.findById(session.teacher.userId);
    teacher.skillCoins += session.skillCoinsValue;
    teacher.totalCoinsEarned += session.skillCoinsValue;
    teacher.totalTeachingSessions += 1;
    await teacher.save();

    // Create transaction record
    const transactionId = `TXN-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const transaction = new CoinTransaction({
      transactionId,
      from: {
        userId: learner._id,
        name: learner.name,
        role: 'Learner'
      },
      to: {
        userId: teacher._id,
        name: teacher.name,
        role: 'Teacher'
      },
      amount: session.skillCoinsValue,
      type: 'Learning',
      sessionId,
      skill: session.skill.skillName,
      status: 'Completed'
    });

    await transaction.save();

    // Update session
    session.coinsTransfered = true;
    await session.save();

    res.json({
      message: 'Coins transferred successfully',
      transaction: {
        from: learner.name,
        to: teacher.name,
        amount: session.skillCoinsValue,
        skill: session.skill.skillName
      },
      learnerBalance: learner.skillCoins,
      teacherBalance: teacher.skillCoins
    });
  } catch (error) {
    res.status(500).json({ message: 'Error transferring coins', error: error.message });
  }
});

// Get transaction history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const transactions = await CoinTransaction.find({
      $or: [
        { 'from.userId': req.user.userId },
        { 'to.userId': req.user.userId }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    res.json({ transactions, count: transactions.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
});

// Leaderboard - Top earning teachers
router.get('/leaderboard/teachers', async (req, res) => {
  try {
    const teachers = await User.find({
      'skillsToTeach.0': { $exists: true }
    })
      .select('name averageRating totalCoinsEarned totalTeachingSessions')
      .sort({ totalCoinsEarned: -1 })
      .limit(10);

    res.json({ leaderboard: teachers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

// Bonus coins (admin function)
router.post('/bonus', verifyToken, async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;

    const user = await User.findById(userId);
    user.skillCoins += amount;
    user.totalCoinsEarned += amount;
    await user.save();

    const transactionId = `BONUS-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const transaction = new CoinTransaction({
      transactionId,
      from: { userId: null, name: 'System', role: 'System' },
      to: { userId, name: user.name, role: 'User' },
      amount,
      type: 'Bonus',
      description: reason,
      status: 'Completed'
    });

    await transaction.save();

    res.json({
      message: 'Bonus coins added',
      user: { name: user.name, skillCoins: user.skillCoins }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding bonus', error: error.message });
  }
});

module.exports = router;
