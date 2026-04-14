// routes/skills.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Search teachers by skill
router.get('/teachers/:skillName', async (req, res) => {
  try {
    const { skillName } = req.params;
    const teachers = await User.find({
      'skillsToTeach.skillName': { $regex: skillName, $options: 'i' }
    }).select('-password');
    
    res.json({
      skill: skillName,
      teachersCount: teachers.length,
      teachers: teachers.map(t => ({
        id: t._id,
        name: t.name,
        rating: t.averageRating,
        sessionsCompleted: t.totalTeachingSessions,
        skills: t.skillsToTeach.filter(s => 
          s.skillName.toLowerCase().includes(skillName.toLowerCase())
        )
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching teachers', error: error.message });
  }
});

// Get learners for a skill
router.get('/learners/:skillName', async (req, res) => {
  try {
    const { skillName } = req.params;
    const learners = await User.find({
      'skillsToLearn.skillName': { $regex: skillName, $options: 'i' }
    }).select('-password');
    
    res.json({
      skill: skillName,
      learnersCount: learners.length,
      learners: learners.map(l => ({
        id: l._id,
        name: l.name,
        skillCoins: l.skillCoins,
        skills: l.skillsToLearn.filter(s => 
          s.skillName.toLowerCase().includes(skillName.toLowerCase())
        )
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learners', error: error.message });
  }
});

// Get all available skills
router.get('/', async (req, res) => {
  try {
    const teachers = await User.find({ 'skillsToTeach.0': { $exists: true } });
    const skillsMap = {};

    teachers.forEach(teacher => {
      teacher.skillsToTeach.forEach(skill => {
        if (!skillsMap[skill.skillName]) {
          skillsMap[skill.skillName] = {
            skillName: skill.skillName,
            teachersCount: 0,
            averageRating: 0
          };
        }
        skillsMap[skill.skillName].teachersCount++;
        skillsMap[skill.skillName].averageRating += teacher.averageRating;
      });
    });

    const skills = Object.values(skillsMap).map(skill => ({
      ...skill,
      averageRating: (skill.averageRating / skill.teachersCount).toFixed(2)
    }));

    res.json({ skills, totalSkills: skills.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
});

// Remove skill to teach
router.delete('/teach/:skillId', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { skillsToTeach: { _id: req.params.skillId } } },
      { new: true }
    );
    res.json({ message: 'Skill removed', skills: user.skillsToTeach });
  } catch (error) {
    res.status(500).json({ message: 'Error removing skill', error: error.message });
  }
});

module.exports = router;
