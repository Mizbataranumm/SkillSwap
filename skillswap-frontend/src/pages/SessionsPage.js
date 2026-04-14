// pages/SessionsPage.js
import React, { useState, useEffect } from 'react';
import { sessionsAPI, coinsAPI, userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Clock, Star, MessageSquare } from 'lucide-react';

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Requested, Accepted, Completed
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratedBy, setRatedBy] = useState('Learner');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [, profileRes] = await Promise.all([
          sessionsAPI.getPendingSessions(),
          userAPI.getProfile()
        ]);

        // Get all user sessions
        const userSessionsRes = await sessionsAPI.getUserSessions(profileRes.data._id);
        setSessions(userSessionsRes.data.sessions);
        setUserProfile(profileRes.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading sessions');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSessions = sessions.filter(session => {
    if (filter === 'All') return true;
    return session.status === filter;
  });

  const handleCompleteSession = async (sessionId) => {
    try {
      await sessionsAPI.completeSession(sessionId);
      // Update session status in UI
      setSessions(sessions.map(s => 
        s._id === sessionId ? { ...s, status: 'Completed' } : s
      ));
      toast.success('Session marked as completed!');
    } catch (error) {
      toast.error('Error completing session');
    }
  };

  const handleTransferCoins = async (sessionId) => {
    try {
      await coinsAPI.transferCoins(sessionId);
      setSessions(sessions.map(s =>
        s._id === sessionId ? { ...s, coinsTransfered: true } : s
      ));
      toast.success('Coins transferred successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error transferring coins');
    }
  };

  const handleRateSession = async () => {
    if (!selectedSession) return;

    try {
      await sessionsAPI.rateSession(
        selectedSession._id,
        rating,
        comment,
        ratedBy
      );
      
      setSessions(sessions.map(s =>
        s._id === selectedSession._id
          ? {
              ...s,
              feedback: {
                ...s.feedback,
                [ratedBy === 'Learner' ? 'fromLearner' : 'fromTeacher']: {
                  rating,
                  comment,
                  ratedAt: new Date()
                }
              }
            }
          : s
      ));

      setShowRatingModal(false);
      setRating(5);
      setComment('');
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error('Error submitting rating');
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage all your learning and teaching sessions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['All', 'Requested', 'Accepted', 'In Progress', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No sessions yet</h3>
            <p className="text-gray-600">
              {filter === 'All'
                ? 'Start by finding a teacher or requesting a session'
                : `No ${filter.toLowerCase()} sessions`}
            </p>
          </div>
        ) : (
          filteredSessions.map(session => (
            <div key={session._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Session Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {userProfile._id === session.teacher.userId
                        ? `Teaching ${session.learner.name}`
                        : `Learning from ${session.teacher.name}`}
                    </h3>
                    <p className="text-blue-100 mt-1">{session.skill.skillName}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold ${
                    session.status === 'Completed' ? 'bg-green-400 text-gray-800' :
                    session.status === 'Accepted' ? 'bg-blue-400 text-gray-800' :
                    session.status === 'In Progress' ? 'bg-yellow-400 text-gray-800' :
                    'bg-orange-400 text-gray-800'
                  }`}>
                    {session.status}
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Coins */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1">SKILLCOINS</p>
                    <p className="text-2xl font-bold text-yellow-600">{session.skillCoinsValue}</p>
                  </div>

                  {/* Duration */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1">DURATION</p>
                    <p className="text-2xl font-bold text-blue-600">{session.duration}m</p>
                  </div>

                  {/* Date */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1">SCHEDULED</p>
                    <p className="text-sm text-gray-800">
                      {session.scheduledTime || 'Pending'}
                    </p>
                  </div>

                  {/* ID */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-1">SESSION ID</p>
                    <p className="text-xs text-gray-800 font-mono truncate">{session.sessionId}</p>
                  </div>
                </div>

                {/* Description */}
                {session.description && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-1">DESCRIPTION</p>
                    <p className="text-gray-800">{session.description}</p>
                  </div>
                )}

                {/* Meeting Link */}
                {session.meetingLink && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">MEETING LINK</p>
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 break-all font-mono text-sm"
                    >
                      {session.meetingLink}
                    </a>
                  </div>
                )}

                {/* Feedback Section */}
                {session.feedback?.fromLearner?.rating && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-semibold mb-2">LEARNER RATING</p>
                    <div className="flex items-center space-x-2">
                      {[...Array(session.feedback.fromLearner.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    {session.feedback.fromLearner.comment && (
                      <p className="text-sm text-gray-700 mt-2">"{session.feedback.fromLearner.comment}"</p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {session.status === 'Requested' && userProfile._id === session.teacher.userId && (
                    <button
                      onClick={() => toast.info('Accept session feature coming soon!')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Accept Request
                    </button>
                  )}

                  {session.status === 'Accepted' && !session.coinsTransfered && (
                    <>
                      <button
                        onClick={() => handleCompleteSession(session._id)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => handleTransferCoins(session._id)}
                        className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                      >
                        Transfer Coins
                      </button>
                    </>
                  )}

                  {session.status === 'Completed' && !session.feedback?.fromLearner?.rating && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setRatedBy('Learner');
                        setShowRatingModal(true);
                      }}
                      className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <Star className="w-4 h-4" />
                      <span>Rate Session</span>
                    </button>
                  )}

                  <button
                    onClick={() => toast.info('Messaging coming soon!')}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rate This Session</h2>

            <div className="space-y-4 mb-6">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  placeholder="Share your feedback..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleRateSession}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
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

export default SessionsPage;
