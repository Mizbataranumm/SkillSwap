# SkillSwap - Peer-to-Peer Skill Learning Platform

## 🎯 Project Overview

**SkillSwap** is a revolutionary peer-to-peer micro-learning platform that empowers students to teach and learn skills from each other using a gamified **SkillCoin economy**. No monetary transactions needed—just knowledge exchange!

### Key Features ✨
- 👥 **Peer-to-Peer Learning** - Teach skills you know, learn skills you want
- ⚡ **SkillCoin Economy** - Earn coins by teaching, spend by learning
- 🤖 **AI-Powered Matching** - Smart algorithm matches learners with perfect teachers
- ⭐ **Rating & Reputation System** - Build trust through verified reviews
- 📊 **Interactive Dashboard** - Track progress and coins in real-time
- 🏆 **Leaderboard** - Compete with top teachers in the community

---

## 🚀 Tech Stack

### **Frontend**
- React 18
- React Router DOM (Navigation)
- TailwindCSS (UI Styling)
- Axios (API Calls)
- Lucide React (Icons)
- React Toastify (Notifications)

### **Backend**
- Node.js & Express.js
- MongoDB (Database)
- JWT (Authentication)
- Mongoose (ODM)
- bcryptjs (Password Hashing)
- CORS (Cross-Origin Requests)

### **Deployment**
- Vercel (Frontend)
- Heroku/Railway (Backend)
- MongoDB Atlas (Database)

---

## 📋 Project Structure

```
skillswap/
├── skillswap-backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── LearningSession.js
│   │   ├── CoinTransaction.js
│   │   └── SkillMatcher.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── skills.js
│   │   ├── sessions.js
│   │   ├── coins.js
│   │   └── matcher.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── skillswap-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   ├── Dashboard.js
    │   │   ├── ProfilePage.js
    │   │   ├── SearchTeachers.js
    │   │   ├── SearchLearners.js
    │   │   ├── MatchesPage.js
    │   │   ├── SessionsPage.js
    │   │   └── LeaderboardPage.js
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

---

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js (v14+)
- MongoDB (local or Atlas)
- Git
- npm or yarn

### **1. Backend Setup**

```bash
# Navigate to backend directory
cd skillswap-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=5000
NODE_ENV=development
BCRYPT_ROUNDS=10
EOF

# Start backend server (development)
npm run dev
# Or production
npm start
```

**Backend will run on:** `http://localhost:5000`

### **2. Frontend Setup**

```bash
# Navigate to frontend directory
cd skillswap-frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000/api
EOF

# Start frontend development server
npm start
```

**Frontend will run on:** `http://localhost:3000`

---

## 🗄️ Database Setup

### **MongoDB Connection**

1. **Using MongoDB Atlas (Cloud):**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free account
   - Create cluster
   - Get connection string
   - Add to `.env`

2. **Using Local MongoDB:**
   ```bash
   # Windows
   mongod
   
   # macOS/Linux
   brew services start mongodb-community
   ```

### **Database Models**

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  skillCoins: Number (default: 100),
  skillsToTeach: Array,
  skillsToLearn: Array,
  averageRating: Number,
  totalTeachingSessions: Number,
  totalLearningSessions: Number,
  totalCoinsEarned: Number,
  totalCoinsSpent: Number
}
```

#### Learning Session Model
```javascript
{
  sessionId: String (unique),
  teacher: Object,
  learner: Object,
  skill: Object,
  skillCoinsValue: Number,
  status: String (Requested|Accepted|In Progress|Completed|Cancelled),
  scheduledTime: String,
  meetingLink: String,
  feedback: Object (ratings & comments),
  coinsTransfered: Boolean
}
```

---

## 📡 API Documentation

### **Authentication Endpoints**

```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **User Endpoints**

```
GET /api/users/profile (requires JWT token)

PUT /api/users/profile
{
  "name": "John Doe",
  "bio": "I teach React and Python"
}

POST /api/users/skills-to-teach
{
  "skillName": "React",
  "level": "Advanced",
  "experience": "5 years"
}

POST /api/users/skills-to-learn
{
  "skillName": "Machine Learning",
  "priority": "High"
}
```

### **Skills Endpoints**

```
GET /api/skills/teachers/:skillName
GET /api/skills/learners/:skillName
GET /api/skills
```

### **Sessions Endpoints**

```
POST /api/sessions/request
{
  "teacherId": "user_id",
  "skillName": "React",
  "duration": 30,
  "skillCoinsOffered": 10,
  "description": "Want to learn hooks"
}

PUT /api/sessions/:sessionId/accept
{
  "scheduledTime": "2024-01-15 10:00 AM",
  "meetingLink": "https://meet.google.com/xxx"
}

PUT /api/sessions/:sessionId/complete

POST /api/sessions/:sessionId/rate
{
  "rating": 5,
  "comment": "Great teacher!",
  "ratedBy": "Learner"
}
```

### **Coins Endpoints**

```
GET /api/coins/balance

POST /api/coins/transfer-session
{
  "sessionId": "session_id"
}

GET /api/coins/history

GET /api/coins/leaderboard/teachers
```

### **Matcher Endpoints (AI)**

```
POST /api/matcher/find-teachers
Response:
{
  "suggestedTeachers": [
    {
      "teacherId": "id",
      "teacherName": "Name",
      "matchScore": 85,
      "matchingSkills": ["React", "JavaScript"]
    }
  ]
}

POST /api/matcher/find-learners
```

---

## 🎮 User Flow

### **For Learner:**
1. Register/Login
2. Add skills you want to learn
3. Search for teachers OR get AI matches
4. Request session from a teacher
5. Attend session (pay with SkillCoins)
6. Rate the teacher
7. Repeat!

### **For Teacher:**
1. Register/Login
2. Add skills you can teach
3. View pending session requests
4. Accept requests from learners
5. Conduct session
6. Earn SkillCoins from learners
7. Rise in leaderboard!

---

## 💡 SkillCoin Economy

### **How It Works:**
- **Starting Balance:** 100 SkillCoins for new users
- **Earning:** Teach a 30-min session = 10-15 coins
- **Spending:** Learn a 30-min session = 10-15 coins
- **Bonus:** Complete 5 sessions = 20 bonus coins
- **Penalty:** Cancel session = -5 coins

### **Session Pricing:**
```
15 minutes  = 5-8 coins
30 minutes  = 10-15 coins
45 minutes  = 15-20 coins
60 minutes  = 20-25 coins
```

---

## 🤖 AI Matching Algorithm

The smart matcher uses a **hybrid scoring system**:

```
Match Score = (Skill Similarity × 0.6) + (Teacher Rating × 0.4)
```

**Factors:**
- ✅ Matching skills (60%)
- ✅ Teacher reputation/rating (40%)
- ✅ Teacher availability
- ✅ Learner's coin availability

---

## 🚀 Deployment

### **Backend Deployment (Heroku)**

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create skillswap-api

# Add environment variables
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### **Frontend Deployment (Vercel)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variable
REACT_APP_API_URL=https://skillswap-api.herokuapp.com/api
```

---

## 🧪 Testing

### **Manual Testing Checklist:**

- [ ] User registration and login
- [ ] Add skills to profile
- [ ] Search for teachers/learners
- [ ] Request a session
- [ ] Accept session request
- [ ] Complete session
- [ ] Transfer coins
- [ ] Rate session
- [ ] Check dashboard stats
- [ ] View leaderboard
- [ ] Get AI matches

---

## 🐛 Troubleshooting

### **Backend Won't Connect to MongoDB**
```bash
# Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
# Check firewall settings
```

### **CORS Errors**
```bash
# Add frontend URL to CORS in backend
# app.use(cors({
#   origin: 'http://localhost:3000'
# }))
```

### **Token Expired**
```bash
# Clear localStorage
# Re-login to get new token
```

---

## 📚 Future Enhancements

- [ ] Video call integration (Agora/Twilio)
- [ ] Messaging system between users
- [ ] Skill verification badges
- [ ] Group sessions
- [ ] Mobile app (React Native)
- [ ] Payment integration (for premium features)
- [ ] Advanced analytics dashboard
- [ ] Referral program
- [ ] Certification system
- [ ] Integration with universities

---

## 📄 License

MIT License - Feel free to use this for your portfolio!

---

## 💬 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review API endpoints

---

## 🎯 Why SkillSwap is Great for Your Resume

✅ **Full-stack application** (Frontend + Backend + Database)  
✅ **Real business logic** (Economy system, AI matching)  
✅ **Production-ready code** (Error handling, validation)  
✅ **Beautiful UI** (Modern design with TailwindCSS)  
✅ **Scalable architecture** (Can handle thousands of users)  
✅ **Unique concept** (Recruiters love original ideas)  
✅ **Complete project** (Not a simple todo app)  

---

## 🏆 Credits

Built with ❤️ for learning enthusiasts everywhere!

*Last updated: 2024*
