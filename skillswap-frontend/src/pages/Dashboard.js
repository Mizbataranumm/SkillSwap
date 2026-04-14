// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coinsAPI, userAPI, sessionsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Zap, Award, TrendingUp, BookOpen, Briefcase, Clock, Star } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [balance, setBalance] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, sessionsRes, profileRes] = await Promise.all([
          coinsAPI.getBalance(),
          sessionsAPI.getUserSessions(user.id),
          userAPI.getProfile()
        ]);

        setBalance(balanceRes.data);
        setSessions(sessionsRes.data.sessions.slice(0, 5)); // Latest 5 sessions
        setProfile(profileRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading dashboard');
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-blue-100">Ready to learn and teach new skills today?</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* SkillCoins Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-gray-500 text-sm">Current Balance</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{balance?.skillCoins || 0}</h3>
          <p className="text-gray-600 text-sm mt-2">SkillCoins</p>
        </div>

        {/* Teaching Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-gray-500 text-sm">Teaching</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{profile?.totalTeachingSessions || 0}</h3>
          <p className="text-gray-600 text-sm mt-2">Sessions Completed</p>
        </div>

        {/* Learning Sessions */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-gray-500 text-sm">Learning</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{profile?.totalLearningSessions || 0}</h3>
          <p className="text-gray-600 text-sm mt-2">Sessions Completed</p>
        </div>

        {/* Rating Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-gray-500 text-sm">Your Rating</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">
            {profile?.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
          </h3>
          <p className="text-gray-600 text-sm mt-2">out of 5.0</p>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Coins Earned & Spent */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Coin Statistics</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Earned</span>
              <span className="font-bold text-green-600">{balance?.totalEarned || 0}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-bold text-red-600">{balance?.totalSpent || 0}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="text-gray-600">Net Balance</span>
              <span className="font-bold text-blue-600">
                {(balance?.totalEarned || 0) - (balance?.totalSpent || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Skills Profile</span>
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Teaching ({profile?.skillsToTeach?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsToTeach?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    {skill.skillName}
                  </span>
                ))}
                {profile?.skillsToTeach?.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                    +{profile.skillsToTeach.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-600 mb-1">Learning ({profile?.skillsToLearn?.length || 0})</p>
              <div className="flex flex-wrap gap-2">
                {profile?.skillsToLearn?.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                    {skill.skillName}
                  </span>
                ))}
                {profile?.skillsToLearn?.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                    +{profile.skillsToLearn.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/search-teachers"
              className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔍 Find Teachers
            </Link>
            <Link
              to="/search-learners"
              className="block w-full bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              👥 Find Learners
            </Link>
            <Link
              to="/matches"
              className="block w-full bg-purple-600 text-white text-center py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              ⚡ Get Matches
            </Link>
            <Link
              to="/profile"
              className="block w-full bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ⚙️ Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-orange-600" />
          <span>Recent Sessions</span>
        </h3>

        {sessions.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No sessions yet. <Link to="/search-teachers" className="text-blue-600 hover:underline">Find a teacher</Link> to get started!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Participant</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Skill</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-semibold">Coins</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">
                      {user.id === session.teacher.userId ? session.learner.name : session.teacher.name}
                    </td>
                    <td className="py-3 px-4 text-gray-800">{session.skill.skillName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        session.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        session.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-800">{session.skillCoinsValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="mt-4 text-center">
            <Link to="/sessions" className="text-blue-600 hover:underline font-semibold">
              View All Sessions →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
