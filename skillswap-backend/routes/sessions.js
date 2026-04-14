// routes/sessions.js
const express = require('express');
const router = express.Router();
const LearningSession = require('../models/LearningSession');
const User = require('../models/User');
const CoinTransaction = require('../models/CoinTransaction');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Request a learning session
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { teacherId, skillName, duration, skillCoinsOffered, description } = req.body;

    // Check if teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Check learner has enough coins
    const learner = await User.findById(req.user.userId);
    if (learner.skillCoins < skillCoinsOffered) {
      return res.status(400).json({ 
        message: 'Insufficient SkillCoins',
        available: learner.skillCoins,
        required: skillCoinsOffered
      });
    }

    const sessionId = `SS-${Date.now()}-${uuidv4().substring(0, 8)}`;

    const session = new LearningSession({
      sessionId,
      teacher: {
        userId: teacherId,
        name: teacher.name,
        rating: teacher.averageRating
      },
      learner: {
        userId: req.user.userId,
        name: learner.name
      },
      skill: {
        skillName,
        skillLevel: teacher.skillsToTeach.find(s => s.skillName === skillName)?.level
      },
      skillCoinsValue: skillCoinsOffered,
      duration: duration || 30,
      description,
      status: 'Requested'
    });

    await session.save();

    res.status(201).json({
      message: 'Session requested successfully',
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting session', error: error.message });
  }
});

// Accept a session request (teacher)
router.put('/:sessionId/accept', verifyToken, async (req, res) => {
  try {
    const { scheduledTime, meetingLink } = req.body;
    const session = await LearningSession.findByIdAndUpdate(
      req.params.sessionId,
      {
        status: 'Accepted',
        scheduledTime,
        meetingLink,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session accepted', session });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting session', error: error.message });
  }
});

// Complete a session
router.put('/:sessionId/complete', verifyToken, async (req, res) => {
  try {
    const session = await LearningSession.findByIdAndUpdate(
      req.params.sessionId,
      { status: 'Completed', updatedAt: Date.now() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session completed', session });
  } catch (error) {
    res.status(500).json({ message: 'Error completing session', error: error.message });
  }
});

// Rate a session
router.post('/:sessionId/rate', verifyToken, async (req, res) => {
  try {
    const { rating, comment, ratedBy } = req.body; // ratedBy: 'Teacher' or 'Learner'

    const session = await LearningSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (ratedBy === 'Teacher') {
      session.feedback.fromTeacher = {
        rating,
        comment,
        ratedAt: Date.now()
      };
    } else if (ratedBy === 'Learner') {
      session.feedback.fromLearner = {
        rating,
        comment,
        ratedAt: Date.now()
      };
    }

    await session.save();

    // Update teacher's average rating
    const teacher = await User.findById(session.teacher.userId);
    const allSessions = await LearningSession.find({ 'teacher.userId': session.teacher.userId });
    const totalRatings = allSessions.reduce((sum, s) => 
      sum + (s.feedback.fromLearner?.rating || 0), 0
    );
    const ratedCount = allSessions.filter(s => s.feedback.fromLearner?.rating).length;

    if (ratedCount > 0) {
      teacher.averageRating = totalRatings / ratedCount;
      teacher.ratingsCount = ratedCount;
      await teacher.save();
    }

    res.json({ message: 'Rating submitted', session });
  } catch (error) {
    res.status(500).json({ message: 'Error rating session', error: error.message });
  }
});

// Get sessions for user
router.get('/user/:userId', async (req, res) => {
  try {
    const sessions = await LearningSession.find({
      $or: [
        { 'teacher.userId': req.params.userId },
        { 'learner.userId': req.params.userId }
      ]
    }).sort({ createdAt: -1 });

    res.json({ sessions, count: sessions.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

// Get all pending sessions (for matching)
router.get('/', async (req, res) => {
  try {
    const sessions = await LearningSession.find({ status: 'Requested' }).sort({ createdAt: -1 });
    res.json({ sessions, count: sessions.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error: error.message });
  }
});

module.exports = router;
