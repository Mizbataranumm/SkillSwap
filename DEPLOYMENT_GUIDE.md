# SkillSwap Complete Setup & Deployment Guide

## 🚀 Quick Start (5 Minutes)

### **Step 1: Clone/Download Project**
```bash
# If on GitHub
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

### **Step 2: Backend Setup**
```bash
cd skillswap-backend

# Install dependencies
npm install

# Create .env file with your MongoDB connection
# Go to MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# Create free cluster and copy connection string

# Edit .env:
nano .env
# or use any text editor

# Paste this:
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=10

# Start backend
npm run dev
```

Backend should show: `SkillSwap Backend running on port 5000`

### **Step 3: Frontend Setup (New Terminal)**
```bash
cd skillswap-frontend

npm install

# Create .env
nano .env

# Add:
REACT_APP_API_URL=http://localhost:5000/api

npm start
```

Frontend should open: `http://localhost:3000`

---

## 🎯 Step-by-Step Full Setup

### **Part 1: MongoDB Setup (Database)**

#### Option A: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up"
3. Create account (free)
4. Create organization
5. Create project "SkillSwap"
6. Click "Build a Database"
7. Choose "Shared" (Free tier)
8. Select region (closest to you)
9. Create cluster (takes 2-3 minutes)
10. Click "Connect"
11. Choose "Drivers"
12. Copy connection string:
    ```
    mongodb+srv://username:password@cluster0.xxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    ```
13. Replace `username`, `password`, `myFirstDatabase` → `skillswap`
14. Add to `.env` in backend

#### Option B: Local MongoDB (Windows/Mac/Linux)
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows: Download from https://www.mongodb.com/try/download/community
# Linux: Follow https://docs.mongodb.com/manual/installation/

# Test connection:
mongosh
# Type: exit
```

Connection string: `mongodb://localhost:27017/skillswap`

---

### **Part 2: Backend Installation**

```bash
cd skillswap-backend

# Install all dependencies
npm install

# This installs:
# - express (web framework)
# - mongoose (database)
# - jwt (authentication)
# - bcryptjs (password hashing)
# - cors (cross-origin requests)

# Create .env file
touch .env

# Edit .env with your editor and add:
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxx.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=change_this_to_something_secure_in_production
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=10
```

### **Part 3: Frontend Installation**

```bash
cd skillswap-frontend

npm install

# This installs:
# - react & react-dom
# - react-router-dom (navigation)
# - axios (API calls)
# - tailwindcss (styling)
# - lucide-react (icons)

touch .env

# Add to .env:
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎮 Testing Locally

### **Test Account 1: Teacher**
```
Email: teacher@example.com
Password: teacher123
Skills to Teach: React, Python, Web Design
```

### **Test Account 2: Learner**
```
Email: learner@example.com
Password: learner123
Skills to Learn: Machine Learning, Design, Guitar
```

### **Testing Workflow:**
1. Register teacher account
2. Add 3 skills (React, Python, Web Design)
3. Open new incognito window
4. Register learner account
5. Add 3 skills to learn
6. Search for React teacher
7. Request session (offer 10 coins)
8. Go back to teacher window
9. Accept session request
10. Mark as completed
11. Transfer coins
12. Rate session
13. Check leaderboard

---

## 🌐 Deployment to Production

### **Option 1: Deploy Backend on Railway.app**

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Click "Deploy from GitHub repo"
5. Select your skillswap repository
6. Add environment variables:
   ```
   MONGODB_URI=your_atlas_connection
   JWT_SECRET=generate_new_secret_here
   PORT=5000
   NODE_ENV=production
   ```
7. Railway auto-deploys on git push
8. Get your backend URL (e.g., `https://skillswap-api.railway.app`)

### **Option 2: Deploy Backend on Heroku**

```bash
# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create skillswap-api

# Add environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="generate_new_secure_secret"
heroku config:set NODE_ENV="production"

# Deploy from git
git push heroku main

# View logs
heroku logs --tail
```

### **Option 3: Deploy Frontend on Vercel**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your repository
5. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
   ```
6. Click Deploy
6. Vercel auto-deploys on git push
7. Get your frontend URL (e.g., `https://skillswap.vercel.app`)

### **Option 4: Deploy on Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd skillswap-frontend
npm run build

# Deploy
netlify deploy --prod --dir=build

# Add environment variable in Netlify dashboard
# REACT_APP_API_URL=https://your-backend-url
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Backend `.env` configured with production MongoDB URI
- [ ] Backend `.env` JWT_SECRET changed to strong random string
- [ ] Backend deployed and tested
- [ ] Frontend `.env` updated with backend URL
- [ ] Frontend built and deployed
- [ ] Test full workflow in production
- [ ] Setup custom domain (optional)
- [ ] Enable HTTPS (automatic on Vercel/Netlify)

---

## 🔒 Security Tips for Production

### **Backend Security:**
```javascript
// 1. Change JWT_SECRET to random string
// Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// 2. Add rate limiting
npm install express-rate-limit

// 3. Add helmet for HTTP headers
npm install helmet
const helmet = require('helmet');
app.use(helmet());

// 4. Validate inputs
npm install express-validator

// 5. Set NODE_ENV=production
```

### **Frontend Security:**
```javascript
// 1. Remove API keys from code
// 2. Use environment variables
// 3. Add CSRF protection
// 4. Sanitize user inputs
```

---

## 📊 Monitoring & Logs

### **Backend Logs (Heroku/Railway)**
```bash
# Heroku
heroku logs --tail

# Railway (check dashboard)
```

### **Frontend Logs (Vercel/Netlify)**
- Check in dashboard's "Analytics" section

### **Database Monitoring (MongoDB Atlas)**
- Go to Atlas dashboard
- Check "Metrics" tab
- Monitor connections, operations, storage

---

## 🐛 Common Issues & Solutions

### **Issue: "Cannot find module express"**
```bash
# Solution:
cd skillswap-backend
npm install
```

### **Issue: "MongoDB connection failed"**
```bash
# Check:
1. Connection string in .env is correct
2. IP address is whitelisted in MongoDB Atlas
3. Username/password are correct
4. Internet connection is stable
```

### **Issue: "CORS error: Access-Control-Allow-Origin"**
```bash
# Solution in backend (server.js):
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-url.vercel.app',
  credentials: true
}));
```

### **Issue: "Port 5000 already in use"**
```bash
# Kill process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### **Issue: "Token expired / Not authenticated"**
```bash
# Solution:
# 1. Clear browser localStorage
# 2. Log out and log back in
# 3. Check JWT_SECRET is same in backend
```

---

## 📈 Performance Optimization

### **Backend:**
```bash
# Add caching
npm install redis

# Add compression
npm install compression
app.use(compression());

# Monitor performance
npm install newrelic
```

### **Frontend:**
```bash
# Code splitting
React.lazy(() => import('./pages/Dashboard'))

# Image optimization
npm install next-image (if using Next.js)

# Bundle analysis
npm install webpack-bundle-analyzer
```

---

## 🧪 Testing in Production

### **Test with Real Data:**
1. Create 5+ user accounts
2. Add different skills
3. Create multiple sessions
4. Transfer coins
5. Rate sessions
6. Check leaderboard
7. Test all filters
8. Test error scenarios

### **Load Testing:**
```bash
npm install -g artillery

# Create load-test.yml:
config:
  target: "https://your-backend-url.herokuapp.com"
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Test API"
    flow:
      - get:
          url: "/api/health"

# Run:
artillery run load-test.yml
```

---

## 📞 Support & Documentation

- Backend API: See API_DOCUMENTATION.md
- Frontend Components: Check component comments
- Database Schema: See database-schema.md
- Troubleshooting: Check this guide

---

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Can register new account
- ✅ Can login successfully
- ✅ Dashboard shows correct data
- ✅ Can search for teachers
- ✅ Can request sessions
- ✅ Coins transfer works
- ✅ Ratings save correctly
- ✅ No console errors
- ✅ API responds in < 500ms

---

## 🚀 Next Steps

1. **Add more features:**
   - Real-time chat/messaging
   - Video call integration
   - Email notifications
   - Payment integration
   - Mobile app

2. **Improve performance:**
   - Add caching
   - Optimize database queries
   - Implement pagination
   - Add indexing

3. **Enhance security:**
   - Add rate limiting
   - Implement 2FA
   - Add email verification
   - Add fraud detection

4. **Scale:**
   - Use CDN for static files
   - Implement load balancing
   - Use message queues
   - Add caching layers

---

Good luck with your deployment! 🎊
