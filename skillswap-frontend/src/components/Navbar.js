// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Users, Zap, Award } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="SkillSwap Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl text-gray-800">SkillSwap</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/search-teachers" className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Find Teachers</span>
            </Link>
            <Link to="/search-learners" className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Find Learners</span>
            </Link>
            <Link to="/matches" className="text-gray-700 hover:text-blue-600 flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>Matches</span>
            </Link>
            <Link to="/sessions" className="text-gray-700 hover:text-blue-600">
              Sessions
            </Link>
            <Link to="/leaderboard" className="text-gray-700 hover:text-blue-600">
              Leaderboard
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/search-teachers"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Teachers
            </Link>
            <Link
              to="/search-learners"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Learners
            </Link>
            <Link
              to="/matches"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              to="/sessions"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sessions
            </Link>
            <Link
              to="/leaderboard"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link
              to="/profile"
              className="block text-gray-700 hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
