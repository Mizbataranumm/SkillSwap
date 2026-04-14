// pages/SearchTeachers.js
import React, { useState, useEffect } from 'react';
import { skillsAPI, sessionsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Search, Star, Briefcase, Award, Clock } from 'lucide-react';

const SearchTeachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    duration: 30,
    skillCoinsOffered: 10,
    description: ''
  });

  const handleSearch = async (skill) => {
    if (!skill.trim()) {
      toast.error('Please enter a skill to search');
      return;
    }

    setLoading(true);
    try {
      const response = await skillsAPI.searchTeachers(skill);
      setTeachers(response.data.teachers);
      
      if (response.data.teachers.length === 0) {
        toast.info('No teachers found for this skill');
      }
    } catch (error) {
      toast.error('Error searching teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSession = async (teacherId) => {
    if (!selectedTeacher) {
      toast.error('Please select a skill first');
      return;
    }

    try {
      await sessionsAPI.requestSession(
        teacherId,
        searchTerm,
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Teacher</h1>
        
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for a skill (e.g., React, Python, Guitar)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch(searchTerm)}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h3 className="text-xl font-bold">{teacher.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">{teacher.rating?.toFixed(1) || 'N/A'}/5.0</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  <span>{teacher.sessionsCompleted || 0} sessions completed</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>{teacher.rating?.toFixed(1) || 'N/A'} average rating</span>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Teaching:</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                    >
                      {skill.skillName}
                      {skill.level && ` (${skill.level})`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setSelectedTeacher(teacher);
                  setShowRequestForm(true);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Request Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Request Session Modal */}
      {showRequestForm && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Request Session with {selectedTeacher.name}
            </h2>

            <div className="space-y-4 mb-6">
              {/* Skill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <input
                  type="text"
                  value={searchTerm}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
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
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              {/* Coins Offered */}
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
                <p className="text-xs text-gray-600 mt-1">💡 Higher coins = Higher priority in teacher's queue</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                  rows="3"
                  placeholder="Tell the teacher what you want to learn..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleRequestSession(selectedTeacher.id)}
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

      {/* Empty State */}
      {!loading && teachers.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No teachers found</h3>
          <p className="text-gray-600">Try searching for a different skill</p>
        </div>
      )}

      {!loading && teachers.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for a skill</h3>
          <p className="text-gray-600">Start by typing a skill name above</p>
        </div>
      )}
    </div>
  );
};

export default SearchTeachers;
