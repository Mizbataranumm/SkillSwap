# SkillSwap | Project Overview 🚀

## 🌟 The Vision
**SkillSwap** is a decentralized, peer-to-peer micro-learning platform designed to democratize education. The core idea is simple: **Everyone has a skill to teach and a skill to learn.** 

Instead of traditional monetary payments, the platform uses **SkillCoins**—a virtual currency that rewards community contribution. If you teach someone a skill, you earn coins; you can then spend those coins to learn something new from another expert in the community. This creates a circular, self-sustaining economy of knowledge.

---

## ✅ What's Built (Current State)

The foundational pillars of the platform are fully implemented and live:

### 1. Robust Full-Stack Core
- **Frontend**: A sleek, reactive React.js application with a premium dark/light mode aesthetic.
- **Backend**: A scalable Node.js/Express API handling all business logic.
- **Database**: MongoDB Atlas cloud integration for secure data persistence.

### 2. Identity & Security
- **Authentication**: Secure JWT-based registration and login system with Bcrypt password hashing.
- **Brand Identity**: Custom-designed logo and consistent project branding integrated across the UI.

### 3. Smart Matching Engine
- **AI-Powered Matcher**: A custom algorithm that analyzes user profiles to suggest the best teachers for your desired skills and the best learners for what you teach.
- **SkillCoins Economy**: System for tracking coin balances, earnings, and expenditures.

### 4. Production Ready (DevOps)
- **Deployment**: The app is live with a production backend on **Render** and a global frontend on **Vercel**.
- **Version Control**: Full Git repository established on GitHub for collaborative development.

---

## 🚀 The Roadmap (Future Development)

To transform SkillSwap into a world-class educational tool, the following features are next in line:

### 1. Integrated Learning Environment
- **Built-in Video Sessions**: Move beyond external links to integrated, peer-to-peer video classes within the app.
- **Whiteboard Collaboration**: Real-time shared whiteboard for technical classes (coding, math, design).

### 2. Real-Time Communication
- **Messenger Pro**: A full-featured in-app chat system for mentors and learners to discuss session details before booking.
- **Push Notifications**: Instant alerts for session requests, coin transfers, and messages.

### 3. Professional Profile Ecosystem
- **Public Portfolio Views**: Enhanced profile pages where users can showcase their teaching history, verified ratings, and "SkillBadges."
- **Booking Calendar**: An interactive scheduling system where teachers set their availability and learners book slots.

### 4. SkillSwap Mobile
- **Native Experience**: Bringing the SkillSwap economy to iOS and Android for learning on the go.

---

---

## 🛠️ Immediate Technical Next Steps

To move from a "Matcher" to a "Functional Classroom," follow this specific technical roadmap:

### 1. The "Classroom" (Video Integration)
- **Goal**: Provide a "Enter Class" button for both the Teacher and Learner.
- **Task**: Integrate a WebRTC provider (e.g., **Jitsi Meet API** or **Daily.co**).
- **Workflow**:
    - When a session status becomes `Active`, generate a unique Room ID.
    - Add a `Classroom.js` component with the embedded video frame.
    - Store the `roomUrl` in the `Session` model.

### 2. Real-Time Interactions (Messaging)
- **Goal**: Allow users to chat before and during sessions.
- **Task**: Implement **Socket.io** on the backend for real-time events.
- **Workflow**:
    - Create a `Chat` model to store message history.
    - Create a `ChatOverlay.js` component available on the Dashboard.
    - Use `socket.emit('send-message', ...)` to sync chat across users.

### 3. Public Professional Profiles
- **Goal**: allow users to browse potential teachers' full bios and reviews.
- **Task**: Create a dynamic route `/profile/:userId`.
- **Workflow**:
    - Add a new API endpoint `GET /api/users/public/:userId`.
    - Build a `PublicProfile.js` page that hides sensitive data (email) but shows "Skills I Teach," "Ratings," and "Teaching Experience."

### 4. Session Slot Management
- **Goal**: Prevent booking overlaps.
- **Task**: Add a "Schedule" field to the teacher's profile.
- **Workflow**:
    - Allow teachers to set "Available Hours."
    - Update the `requestSession` logic to check against the teacher's schedule.

---

**SkillSwap is not just an app; it's a movement to make the world's knowledge accessible to everyone, for free.** 🤝📈
