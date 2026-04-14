// pages/SearchLearners.js
import React, { useState, useEffect } from 'react';
import { skillsAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Search, Zap, Users, Award } from 'lucide-react';

const SearchLearners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setUserProfile(response.data);
      } catch (error) {
        console.log('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSearch = async (skill) => {
    if (!skill.trim()) {
      toast.error('Please enter a skill to search');
      return;
    }

    setLoading(true);
    try {
      const response = await skillsAPI.searchLearners(skill);
      setLearners(response.data.learners);

      if (response.data.learners.length === 0) {
        toast.info('No learners looking for this skill');
      }
    } catch (error) {
      toast.error('Error searching learners');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (learnerId) => {
    toast.info('Message feature coming soon!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Learners</h1>
        <p className="text-gray-600 mb-6">
          {userProfile?.skillsToTeach?.length > 0
            ? `You teach: ${userProfile.skillsToTeach.map(s => s.skillName).join(', ')}`
            : 'Add skills to your profile to find learners'}
        </p>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by skill you teach..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch(searchTerm)}
            disabled={loading}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Learners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learners.map((learner) => (
          <div key={learner.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <h3 className="text-xl font-bold">{learner.name}</h3>
              <div className="flex items-center space-x-2 mt-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">{learner.skillCoins} SkillCoins</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              {/* Skills they want to learn */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Wants to learn:</p>
                <div className="flex flex-wrap gap-2">
                  {learner.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1 rounded-full ${
                        skill.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : skill.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {skill.skillName}
                      {skill.priority && ` (${skill.priority})`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coins Badge */}
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  This learner has <span className="font-bold text-amber-600">{learner.skillCoins}</span> coins available
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => sendMessage(learner.id)}
                  className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Message
                </button>
                <button
                  onClick={() => toast.info('View profile feature coming soon!')}
                  className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && learners.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No learners found</h3>
          <p className="text-gray-600">Try searching for a different skill</p>
        </div>
      )}

      {!loading && learners.length === 0 && !searchTerm && (
        <div className="text-center py-16">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for learners</h3>
          <p className="text-gray-600">Start by typing a skill you teach above</p>
        </div>
      )}
    </div>
  );
};

export default SearchLearners;
