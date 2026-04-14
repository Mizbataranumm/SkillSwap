// pages/MatchesPage.js
import React, { useState, useEffect } from 'react';
import { matcherAPI, sessionsAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Zap, Users, Lightbulb, Award, MessageSquare, Calendar } from 'lucide-react';

const MatchesPage = () => {
  const [matches, setMatches] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' or 'learners'
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    duration: 30,
    skillCoinsOffered: 10,
    description: ''
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const [profileRes, matchesRes] = await Promise.all([
          userAPI.getProfile(),
          matcherAPI.findTeachers()
        ]);

        setUserProfile(profileRes.data);
        setMatches(matchesRes.data);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error('Please add skills to your profile first');
        } else {
          toast.error('Error loading matches');
        }
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleFindLearners = async () => {
    try {
      const res = await matcherAPI.findLearners();
      setMatches(res.data);
      setActiveTab('learners');
      toast.success('Learners matched!');
    } catch (error) {
      toast.error('Error finding learners');
    }
  };

  const handleRequestSession = async (teacherId, skillName) => {
    try {
      await sessionsAPI.requestSession(
        teacherId,
        skillName,
        requestData.duration,
        requestData.skillCoinsOffered,
        requestData.description
      );
      toast.success('Session request sent!');
      setShowRequestForm(false);
      setRequestData({ duration: 30, skillCoinsOffered: 10, description: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error requesting session');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI-Powered Matches</h1>
        </div>
        <p className="text-purple-100">
          Our smart algorithm matches you with the best teachers & learners based on skills & ratings
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'teachers'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          🎓 Find Teachers
        </button>
        <button
          onClick={handleFindLearners}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'learners'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          👥 Find Learners
        </button>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeTab === 'teachers' && matches?.suggestedTeachers?.map((teacher, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{teacher.teacherName}</h3>
                <div className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                  {teacher.matchScore}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>{teacher.rating?.toFixed(1) || 'N/A'}/5.0</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Match Score Explanation */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-semibold mb-2">Why matched?</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.matchingSkills?.map((skill, sidx) => (
                    <span key={sidx} className="bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coins Badge */}
              <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">Suggested: 10-15 coins</span> per session
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSelectedMatch(teacher);
                    setShowRequestForm(true);
                  }}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Request
                </button>
                <button
                  onClick={() => toast.info('Coming soon!')}
                  className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'learners' && matches?.suggestedLearners?.map((learner, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{learner.learnerName}</h3>
                <div className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                  {learner.matchScore}%
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>{learner.skillCoins} coins available</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Match Skills */}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 font-semibold mb-2">Wants to learn:</p>
                <div className="flex flex-wrap gap-2">
                  {learner.matchingSkills?.map((skill, sidx) => (
                    <span key={sidx} className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coins Info */}
              <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-sm text-gray-700">
                  <span className="font-bold">{learner.skillCoins}</span> coins to spend
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toast.info('Coming soon!')}
                  className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm"
                >
                  Message
                </button>
                <button
                  onClick={() => toast.info('Coming soon!')}
                  className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!matches?.suggestedTeachers?.length && activeTab === 'teachers' && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No matches yet</h3>
          <p className="text-gray-600">Add skills to your profile to get AI-powered matches</p>
        </div>
      )}

      {/* Request Session Modal */}
      {showRequestForm && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Request Session with {selectedMatch.teacherName}
            </h2>

            <div className="space-y-4 mb-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {selectedMatch.matchingSkills?.[0] || 'N/A'}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={requestData.duration}
                  onChange={(e) => setRequestData({ ...requestData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              {/* Coins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SkillCoins to Offer
                </label>
                <input
                  type="number"
                  min="1"
                  value={requestData.skillCoinsOffered}
                  onChange={(e) => setRequestData({ ...requestData, skillCoinsOffered: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                  rows="3"
                  placeholder="Tell the teacher about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleRequestSession(selectedMatch.teacherId, selectedMatch.matchingSkills?.[0])}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Send Request
              </button>
              <button
                onClick={() => setShowRequestForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesPage;
