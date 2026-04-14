// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, bio, profileImage, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Add skill to teach
router.post('/skills-to-teach', verifyToken, async (req, res) => {
  try {
    const { skillName, level, experience } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          skillsToTeach: {
            skillName,
            level: level || 'Intermediate',
            experience,
            verified: false
          }
        }
      },
      { new: true }
    );
    res.json({ message: 'Skill added', skills: user.skillsToTeach });
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error: error.message });
  }
});

// Add skill to learn
router.post('/skills-to-learn', verifyToken, async (req, res) => {
  try {
    const { skillName, priority } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          skillsToLearn: {
            skillName,
            priority: priority || 'Medium'
          }
        }
      },
      { new: true }
    );
    res.json({ message: 'Learning skill added', skills: user.skillsToLearn });
  } catch (error) {
    res.status(500).json({ message: 'Error adding learning skill', error: error.message });
  }
});

// Get user by ID (public profile)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Get all users (for matching)
router.get('/', async (req, res) => {
  try {
    const { skill, limit = 20 } = req.query;
    let query = {};
    if (skill) {
      query = { 'skillsToTeach.skillName': skill };
    }
    const users = await User.find(query)
      .select('-password')
      .limit(parseInt(limit));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
