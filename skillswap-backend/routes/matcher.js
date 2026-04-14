// routes/matcher.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const SkillMatcher = require('../models/SkillMatcher');
const { verifyToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Skill similarity scoring algorithm
const calculateMatchScore = (learnerSkills, teacherSkills, teacherRating) => {
  let matchScore = 0;

  // Check for matching skills
  const matchingSkills = learnerSkills.filter(ls =>
    teacherSkills.some(ts => 
      ts.skillName.toLowerCase() === ls.skillName.toLowerCase()
    )
  );

  // Skill match contributes 60% of score
  const skillMatchPercentage = (matchingSkills.length / learnerSkills.length) * 100;
  matchScore += skillMatchPercentage * 0.6;

  // Rating contributes 40% of score
  matchScore += (teacherRating / 5) * 100 * 0.4;

  return Math.round(matchScore);
};

// Get smart skill matches
router.post('/find-teachers', verifyToken, async (req, res) => {
  try {
    const learner = await User.findById(req.user.userId);
    
    if (!learner.skillsToLearn || learner.skillsToLearn.length === 0) {
      return res.status(400).json({ 
        message: 'Add skills you want to learn first' 
      });
    }

    // Get all potential teachers
    const potentialTeachers = await User.find({
      _id: { $ne: req.user.userId }, // Exclude self
      'skillsToTeach.0': { $exists: true }
    });

    // Calculate match scores
    const suggestedTeachers = potentialTeachers
      .map(teacher => ({
        teacherId: teacher._id,
        teacherName: teacher.name,
        rating: teacher.averageRating,
        skillCoins: teacher.skillCoins,
        matchingSkills: teacher.skillsToTeach
          .filter(ts =>
            learner.skillsToLearn.some(ls =>
              ls.skillName.toLowerCase() === ts.skillName.toLowerCase()
            )
          )
          .map(s => s.skillName),
        matchScore: calculateMatchScore(
          learner.skillsToLearn,
          teacher.skillsToTeach,
          teacher.averageRating
        ),
        sessionsSuggested: 0
      }))
      .filter(t => t.matchingSkills.length > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    // Save match to database
    const matchId = `MATCH-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const skillMatch = new SkillMatcher({
      matchId,
      learner: {
        userId: learner._id,
        name: learner.name,
        skillsToLearn: learner.skillsToLearn.map(s => s.skillName)
      },
      suggestedTeachers,
      matchAlgorithm: 'Hybrid'
    });

    await skillMatch.save();

    res.json({
      message: 'Teachers matched successfully',
      matchId,
      learnerSkills: learner.skillsToLearn.map(s => s.skillName),
      suggestedTeachers,
      totalMatches: suggestedTeachers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error finding teachers', error: error.message });
  }
});

// Get smart skill matches for learners (for teachers)
router.post('/find-learners', verifyToken, async (req, res) => {
  try {
    const teacher = await User.findById(req.user.userId);

    if (!teacher.skillsToTeach || teacher.skillsToTeach.length === 0) {
      return res.status(400).json({
        message: 'Add skills you want to teach first'
      });
    }

    // Get all potential learners
    const potentialLearners = await User.find({
      _id: { $ne: req.user.userId },
      'skillsToLearn.0': { $exists: true }
    });

    // Calculate match scores
    const suggestedLearners = potentialLearners
      .map(learner => ({
        learnerId: learner._id,
        learnerName: learner.name,
        skillCoins: learner.skillCoins,
        matchingSkills: learner.skillsToLearn
          .filter(ls =>
            teacher.skillsToTeach.some(ts =>
              ts.skillName.toLowerCase() === ls.skillName.toLowerCase()
            )
          )
          .map(s => s.skillName),
        matchScore: calculateMatchScore(
          learner.skillsToLearn,
          teacher.skillsToTeach,
          teacher.averageRating
        )
      }))
      .filter(l => l.matchingSkills.length > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    // Save match to database
    const matchId = `MATCH-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const skillMatch = new SkillMatcher({
      matchId,
      learner: {
        userId: teacher._id,
        name: teacher.name,
        skillsToLearn: teacher.skillsToTeach.map(s => s.skillName)
      },
      suggestedTeachers: suggestedLearners.map(l => ({
        teacherId: l.learnerId,
        teacherName: l.learnerName,
        matchingSkills: l.matchingSkills,
        matchScore: l.matchScore,
        sessionsSuggested: 0
      })),
      matchAlgorithm: 'Hybrid'
    });

    await skillMatch.save();

    res.json({
      message: 'Learners matched successfully',
      matchId,
      teacherSkills: teacher.skillsToTeach.map(s => s.skillName),
      suggestedLearners,
      totalMatches: suggestedLearners.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error finding learners', error: error.message });
  }
});

// Get all matches
router.get('/', verifyToken, async (req, res) => {
  try {
    const matches = await SkillMatcher.find({
      'learner.userId': req.user.userId
    }).sort({ createdAt: -1 });

    res.json({ matches, count: matches.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error: error.message });
  }
});

module.exports = router;
