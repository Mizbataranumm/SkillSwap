// pages/LeaderboardPage.js
import React, { useState, useEffect } from 'react';
import { coinsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Award, Star, TrendingUp, Medal } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await coinsAPI.getLeaderboard();
        setLeaderboard(response.data.leaderboard);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  const getMedalColor = (index) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getMedalIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Top Teachers</h1>
        </div>
        <p className="text-yellow-100">
          Celebrating the best teachers in the SkillSwap community
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-700 font-bold">Rank</th>
                <th className="text-left py-4 px-6 text-gray-700 font-bold">Teacher Name</th>
                <th className="text-center py-4 px-6 text-gray-700 font-bold">Rating</th>
                <th className="text-center py-4 px-6 text-gray-700 font-bold">Sessions</th>
                <th className="text-center py-4 px-6 text-gray-700 font-bold">Coins Earned</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((teacher, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-gray-50' : idx === 2 ? 'bg-orange-50' : ''
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span className={`text-3xl font-bold ${getMedalColor(idx)}`}>
                        {getMedalIcon(idx)}
                      </span>
                    </div>
                  </td>

                  {/* Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{teacher.name}</p>
                        <p className="text-xs text-gray-600">Top Educator</p>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(teacher.averageRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-800">
                        {teacher.averageRating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Sessions */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                      {teacher.totalTeachingSessions || 0}
                    </div>
                  </td>

                  {/* Coins Earned */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-2xl">⚡</span>
                      <span className="font-bold text-yellow-600 text-lg">
                        {teacher.totalCoinsEarned || 0}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {leaderboard.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No teachers yet</h3>
          <p className="text-gray-600">Be the first to start teaching!</p>
        </div>
      )}

      {/* Stats Cards */}
      {leaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Top Teacher */}
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🥇 Top Teacher</h3>
            <p className="text-2xl font-bold text-gray-800">{leaderboard[0]?.name}</p>
            <p className="text-sm text-gray-600 mt-2">
              {leaderboard[0]?.totalTeachingSessions || 0} sessions completed
            </p>
          </div>

          {/* Highest Coins */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Most Coins Earned</h3>
            <p className="text-3xl font-bold text-green-600">
              {Math.max(...leaderboard.map(t => t.totalCoinsEarned || 0))}
            </p>
            <p className="text-sm text-gray-600 mt-2">SkillCoins</p>
          </div>

          {/* Best Rating */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⭐ Best Rating</h3>
            <div className="flex items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">5.0 out of 5.0</p>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 How to Rank High?</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Complete more teaching sessions</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Maintain high ratings from learners</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Earn more SkillCoins through teaching</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-blue-600 font-bold">✓</span>
            <span>Provide quality instruction and feedback</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeaderboardPage;
