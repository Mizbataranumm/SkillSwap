// server.js
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google DNS for MongoDB Atlas SRV resolution
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/coins', require('./routes/coins'));
app.use('/api/matcher', require('./routes/matcher'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'SkillSwap Backend is Running', status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SkillSwap Backend running on port ${PORT}`);
});
