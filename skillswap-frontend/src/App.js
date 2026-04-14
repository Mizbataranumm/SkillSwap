// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import SearchTeachers from './pages/SearchTeachers';
import SearchLearners from './pages/SearchLearners';
import MatchesPage from './pages/MatchesPage';
import SessionsPage from './pages/SessionsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {isAuthenticated && <Navbar user={user} onLogout={handleLogout} />}
        
        <ToastContainer position="bottom-right" autoClose={3000} />
        
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/search-teachers" element={<SearchTeachers />} />
              <Route path="/search-learners" element={<SearchLearners />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
