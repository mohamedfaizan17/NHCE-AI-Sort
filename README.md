# Socratic Sort 🎓

> An AI-powered educational platform that teaches sorting algorithms through Socratic dialogue and interactive visualizations.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square&logo=prisma)

## 🌟 Overview

Socratic Sort revolutionizes algorithm education by combining AI-driven Socratic tutoring with real-time D3.js visualizations. Students learn through guided questioning rather than passive lectures, with the AI adapting to their understanding level and providing personalized feedback.

## ✨ Key Features

### 🤖 AI-Powered Socratic Tutoring
- **Google Gemini 2.5 Flash** integration for intelligent questioning
- **Adaptive dialogue** that adjusts to student's mastery level
- **Real-time feedback** with XP rewards for correct answers
- **Fresh sessions** - chat history resets on login while preserving progress

### 🎨 Interactive Visualizations
- **D3.js powered** bar chart animations
- **Real-time updates** synchronized with AI guidance
- **State highlighting** - comparing (yellow), swapping (purple), sorted (green)
- **Responsive design** with smooth transitions

### 📚 Practice Problems
- **LeetCode Questions** button unlocks curated coding problems
- **Multi-platform links** - LeetCode, GeeksforGeeks, HackerRank
- **Difficulty ratings** and problem descriptions
- **Algorithm-specific** problem sets for each sorting technique

### 🎮 Gamification System
- **XP & Leveling** - earn points for correct answers
- **Badge System** - unlock achievements at XP milestones
- **Streak Tracking** - daily engagement rewards
- **Global Leaderboard** - compete with other learners
- **Progress Analytics** - track mastery per algorithm

### 👤 User Management
- **Firebase Authentication** - secure login/signup
- **Account Details Page** - manage profile and view stats
- **Avatar Dropdown Menu** - quick access to account and logout
- **Profile Customization** - update display name

### 🎙️ Voice Features
- **Text-to-Speech** - AI responses read aloud
- **Multiple Voices** - choose your preferred mentor
- **Mute Controls** - toggle audio on/off

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion + D3.js
- **Authentication**: Firebase Auth
- **Database**: Prisma + SQLite

### Backend
- **API Layer**: Next.js API Routes
- **AI Backend**: Python FastAPI
- **AI Model**: Google Gemini 2.5 Flash
- **Framework**: LangChain

## 📁 Project Structure

```
socratic-sort/
├── app/
│   ├── page.tsx                   # Main learning interface
│   ├── account/page.tsx           # User profile & stats
│   ├── practice/[algorithm]/      # LeetCode questions page
│   └── api/
│       ├── chat/send/route.ts     # Chat orchestration
│       └── user/profile/route.ts  # User data management
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Top bar with avatar dropdown
│   │   └── Sidebar.tsx            # Algorithm selection
│   ├── visualizer/
│   │   ├── SortVisualizer.tsx     # D3.js visualization
│   │   └── VisualizerControls.tsx # Controls + LeetCode button
│   └── chat/
│       ├── ChatPanel.tsx          # Chat interface
│       ├── ChatMessage.tsx        # Message display
│       └── ChatInput.tsx          # Input with voice
│
├── hooks/
│   ├── useD3Sort.ts               # D3.js visualization logic
│   ├── useSpeech.ts               # TTS integration
│   └── useSocraticTutor.ts        # AI dialogue handler
│
├── lib/
│   ├── leetcode-questions.ts     # Curated problem database
│   ├── firebase.ts               # Auth configuration
│   └── utils.ts                  # Helper functions
│
├── backend/                      # Python AI backend
│   ├── main.py                   # FastAPI server
│   ├── core/
│   │   ├── tutor.py              # Gemini integration
│   │   └── prompts.py            # Socratic prompts
│   └── api/v1/chat.py            # Chat endpoint
│
└── prisma/
    ├── schema.prisma             # Database schema
    └── dev.db                    # SQLite database
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Firebase Project
- Google AI Studio API Key (Gemini)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/socratic-sort.git
cd socratic-sort
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Initialize database
npx prisma db push
```

### 3. Environment Variables

Create `.env.local` in root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Database
DATABASE_URL="file:./prisma/dev.db"

# Python Backend
PYTHON_BACKEND_URL=http://localhost:8000

# Google AI
GOOGLE_AI_API_KEY=your_gemini_api_key
```

Create `backend/.env`:

```env
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### 4. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt
```

### 5. Run Application

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Visit `http://localhost:3000`

## 🎯 How It Works

### Learning Flow

1. **Login** - Authenticate with Firebase
2. **Select Algorithm** - Choose from 6 sorting algorithms in sidebar
3. **Chat with AI** - Answer Socratic questions about the algorithm
4. **Watch Visualization** - See array elements highlighted and swapped in real-time
5. **Earn XP** - Get points for correct answers (+5 XP)
6. **Unlock Badges** - Reach XP milestones (100, 200, 400, 600, 800, 1000, 1500, 2000)
7. **Practice Problems** - Click "LeetCode Questions" to solve real coding challenges

### AI Conversation System

- **Fresh Start**: Chat history resets on each login
- **Progress Preserved**: XP, mastery, and badges persist across sessions
- **Context Aware**: AI receives last 10 messages for context within session
- **Adaptive**: Questions adjust based on your mastery level (0-100%)

### Visualization States

- **Idle** (Blue): Default state
- **Comparing** (Yellow): AI asking about comparison
- **Swapping** (Purple): Elements being swapped
- **Sorted** (Green): Algorithm complete

### XP & Badges System

| XP Milestone | Badge |
|--------------|-------|
| 100 XP | 🎯 First Steps |
| 200 XP | 🥉 Bronze Achiever |
| 400 XP | 🥈 Silver Champion |
| 600 XP | 🥇 Gold Legend |
| 800 XP | 🫧 Bubble Master |
| 1000 XP | ⚡ Quick Sorter |
| 1500 XP | 🔥 Week Warrior |
| 2000 XP | ⭐ Rising Star |

## 📊 Supported Algorithms

1. **Bubble Sort** - Compare adjacent elements
2. **Selection Sort** - Find minimum and swap
3. **Insertion Sort** - Build sorted array one element at a time
4. **Merge Sort** - Divide and conquer approach
5. **Quick Sort** - Partition-based sorting
6. **Heap Sort** - Binary heap data structure

Each algorithm has:
- Dedicated Socratic dialogue flow
- Custom visualization colors
- Curated LeetCode problems
- Mastery tracking (0-100%)

## 🔐 Security

- Firebase Auth tokens verified server-side
- API keys in environment variables
- User data scoped by Firebase UID
- CORS configured for frontend domain only

## 🎨 UI Features

- **Dark/Light Mode** - Theme toggle in header
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Framer Motion transitions
- **Modern Components** - shadcn/ui library
- **Dropdown Menu** - Avatar menu with Account Details & Logout

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
Deploy Python FastAPI backend using Railway or Render dashboard.

### Database
For production, migrate to PostgreSQL:
```bash
# Update DATABASE_URL in .env
npx prisma db push
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- LangChain for AI orchestration
- shadcn/ui for component library
- D3.js for visualizations
- Vercel for Next.js framework

---

**Built with ❤️ for students who learn best through conversation**
