// pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Edit2, Plus, Trash2, Save, X, User, BookOpen, Briefcase } from 'lucide-react';

const ProfilePage = ({ user, setUser }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: ''
  });
  const [showAddSkillTeach, setShowAddSkillTeach] = useState(false);
  const [showAddSkillLearn, setShowAddSkillLearn] = useState(false);
  const [newSkillTeach, setNewSkillTeach] = useState({
    skillName: '',
    level: 'Intermediate',
    experience: ''
  });
  const [newSkillLearn, setNewSkillLearn] = useState({
    skillName: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.data);
        setEditData({
          name: response.data.name,
          bio: response.data.bio
        });
        setLoading(false);
      } catch (error) {
        toast.error('Error loading profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await userAPI.updateProfile(editData);
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleAddSkillTeach = async () => {
    if (!newSkillTeach.skillName) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      await userAPI.addSkillToTeach(
        newSkillTeach.skillName,
        newSkillTeach.level,
        newSkillTeach.experience
      );
      
      const updatedProfile = await userAPI.getProfile();
      setProfile(updatedProfile.data);
      
      setNewSkillTeach({ skillName: '', level: 'Intermediate', experience: '' });
      setShowAddSkillTeach(false);
      toast.success('Skill added successfully!');
    } catch (error) {
      toast.error('Error adding skill');
    }
  };

  const handleAddSkillLearn = async () => {
    if (!newSkillLearn.skillName) {
      toast.error('Please enter a skill name');
      return;
    }

    try {
      await userAPI.addSkillToLearn(
        newSkillLearn.skillName,
        newSkillLearn.priority
      );
      
      const updatedProfile = await userAPI.getProfile();
      setProfile(updatedProfile.data);
      
      setNewSkillLearn({ skillName: '', priority: 'Medium' });
      setShowAddSkillLearn(false);
      toast.success('Learning skill added successfully!');
    } catch (error) {
      toast.error('Error adding learning skill');
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
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>

            {/* Profile Info */}
            {!isEditing ? (
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{profile?.name}</h1>
                <p className="text-gray-600 mt-2">{profile?.email}</p>
                {profile?.bio && <p className="text-gray-700 mt-3 max-w-lg">{profile.bio}</p>}
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{profile?.totalTeachingSessions || 0} Teaching Sessions</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{profile?.totalLearningSessions || 0} Learning Sessions</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="mt-4 md:mt-0 flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({ name: profile.name, bio: profile.bio });
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rating Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Average Rating</h3>
          <p className="text-4xl font-bold text-yellow-500">
            {profile?.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
          </p>
          <p className="text-gray-600 text-sm mt-2">out of 5.0 ({profile?.ratingsCount || 0} ratings)</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Coins Earned</h3>
          <p className="text-4xl font-bold text-green-600">{profile?.totalCoinsEarned || 0}</p>
          <p className="text-gray-600 text-sm mt-2">from teaching</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Coins Spent</h3>
          <p className="text-4xl font-bold text-red-600">{profile?.totalCoinsSpent || 0}</p>
          <p className="text-gray-600 text-sm mt-2">on learning</p>
        </div>
      </div>

      {/* Skills Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills to Teach */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-green-600" />
              <span>Skills I Teach</span>
            </h2>
            <button
              onClick={() => setShowAddSkillTeach(!showAddSkillTeach)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {showAddSkillTeach && (
            <div className="bg-green-50 p-4 rounded-lg mb-6 space-y-3">
              <input
                type="text"
                placeholder="Skill name (e.g., React, Python, Guitar)"
                value={newSkillTeach.skillName}
                onChange={(e) => setNewSkillTeach({ ...newSkillTeach, skillName: e.target.value })}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <select
                value={newSkillTeach.level}
                onChange={(e) => setNewSkillTeach({ ...newSkillTeach, level: e.target.value })}
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <textarea
                placeholder="Your experience (e.g., 3 years, completed projects, certifications)"
                value={newSkillTeach.experience}
                onChange={(e) => setNewSkillTeach({ ...newSkillTeach, experience: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddSkillTeach}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowAddSkillTeach(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {profile?.skillsToTeach?.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No skills added yet. Add your first skill to start teaching!</p>
          ) : (
            <div className="space-y-3">
              {profile?.skillsToTeach?.map((skill, idx) => (
                <div key={idx} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{skill.skillName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="bg-green-200 px-2 py-1 rounded text-xs">{skill.level}</span>
                      </p>
                      {skill.experience && (
                        <p className="text-sm text-gray-600 mt-2">{skill.experience}</p>
                      )}
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills to Learn */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Skills I Want to Learn</span>
            </h2>
            <button
              onClick={() => setShowAddSkillLearn(!showAddSkillLearn)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {showAddSkillLearn && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6 space-y-3">
              <input
                type="text"
                placeholder="Skill name (e.g., Web Design, Spanish, Photography)"
                value={newSkillLearn.skillName}
                onChange={(e) => setNewSkillLearn({ ...newSkillLearn, skillName: e.target.value })}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                value={newSkillLearn.priority}
                onChange={(e) => setNewSkillLearn({ ...newSkillLearn, priority: e.target.value })}
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSkillLearn}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowAddSkillLearn(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {profile?.skillsToLearn?.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No skills added yet. Add skills you want to learn!</p>
          ) : (
            <div className="space-y-3">
              {profile?.skillsToLearn?.map((skill, idx) => (
                <div key={idx} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{skill.skillName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className={`px-2 py-1 rounded text-xs ${
                          skill.priority === 'High' ? 'bg-red-200' :
                          skill.priority === 'Medium' ? 'bg-yellow-200' :
                          'bg-green-200'
                        }`}>
                          {skill.priority} Priority
                        </span>
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
