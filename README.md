# Socratic Sort 🎓

> An AI-first educational platform that teaches sorting algorithms through real-time Socratic dialogue and dynamic D3.js visualizations.

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)
![Firebase](https://img.shields.io/badge/Firebase-Auth-orange?style=flat-square&logo=firebase)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square&logo=prisma)

## 🌟 Overview

Socratic Sort is a production-grade learning platform that revolutionizes how students understand sorting algorithms. Instead of passive tutorials, learners engage in a bidirectional conversation with "Sort-crates," an AI Socratic tutor powered by Google's Gemini, while watching synchronized D3.js animations that respond to their understanding in real-time.

### Core Experience

- **AI-Driven Dialogue**: Real-time Socratic questioning that adapts to your mastery level
- **Synchronized Visualizations**: D3.js animations that respond to AI guidance
- **Voice Interaction**: Full speech-to-text and text-to-speech with multiple mentor voices
- **Gamification**: XP, badges, streaks, and leaderboards to maintain engagement
- **Error Diagnosis**: Visual sandbox that replays your misconceptions

## ✨ Features

### 🤖 AI-Powered Learning
- **LangChain + Gemini 2.5**: Sophisticated Socratic tutoring with structured JSON responses
- **Adaptive Questioning**: AI analyzes your mastery and adjusts difficulty
- **Contextual Hints**: Three-tier hint system (subtle → explicit)
- **Error Analysis**: AI diagnoses misconceptions and provides targeted challenges

### 🎨 Premium UI/UX
- **Modern Aesthetic**: Inspired by Linear, Vercel, and modern IDEs
- **Responsive Layout**: 
  - Desktop: Three-column (Navigation | Visualizer | Chat)
  - Mobile: Tabbed interface with smooth transitions
- **Dark/Light Mode**: Theme-aware visualizations and UI
- **Fluid Animations**: Framer Motion for UI, D3.js transitions for data

### 📊 Interactive Visualizations
- **D3.js Powered**: Real-time SVG/Canvas rendering
- **State Synchronization**: Visualizer responds to AI's guidance
- **Smooth Transitions**: Cubic easing for all animations
- **Focus Highlighting**: Dynamic color changes for algorithm steps

### 🎮 Gamification System
- **XP & Leveling**: Earn points for correct answers and insights
- **Badge System**: Unlock achievements for mastery milestones
- **Streak Tracking**: Daily engagement rewards
- **Global Leaderboard**: Compete with learners worldwide
- **Progress Analytics**: Track mastery across all algorithms

### 🎙️ Voice Features
- **Speech-to-Text**: Hands-free interaction via Web Speech API
- **Text-to-Speech**: Multiple mentor voices via Gemini TTS
- **Audio Playback**: PCM to WAV conversion with mute controls
- **Voice Selection**: Choose your preferred mentor personality

### 🔍 Error Diagnosis Mode
- **Visual Debugging**: Mini-visualizer replays your incorrect logic
- **Red Highlighting**: Shows where your reasoning fails
- **Test Case Generation**: AI creates edge cases that break your understanding

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion + D3.js
- **Icons**: Lucide React
- **Authentication**: Firebase Auth

### Backend
- **API Layer**: Next.js API Routes (Data Orchestration)
- **AI Backend**: Python FastAPI
- **Database**: SQLite (via Prisma ORM)
- **AI Framework**: LangChain
- **AI Model**: Google Gemini 2.5 Flash Preview

### Infrastructure
- **ORM**: Prisma
- **Auth**: Firebase
- **TTS/STT**: Gemini TTS API + Web Speech API

## 📁 Project Structure

```
socratic-sort/
├── app/
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Main app page
│   └── api/                       # Next.js API routes
│       ├── user/
│       │   └── profile/route.ts   # User profile CRUD
│       ├── chat/
│       │   ├── history/route.ts   # Chat history retrieval
│       │   └── send/route.ts      # Main orchestration endpoint
│       └── leaderboard/route.ts   # Global leaderboard
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Logo, avatar, XP, theme toggle
│   │   ├── Sidebar.tsx            # Algorithm selection, badges
│   │   └── MainLayout.tsx         # 3-panel responsive layout
│   ├── visualizer/
│   │   ├── SortVisualizer.tsx     # D3.js canvas wrapper
│   │   ├── VisualizerControls.tsx # Speed, start/pause/reset
│   │   └── SandboxVisualizer.tsx  # Error diagnosis mini-viz
│   ├── chat/
│   │   ├── ChatPanel.tsx          # Complete chat interface
│   │   ├── ChatMessage.tsx        # Styled messages (user/ai/system)
│   │   └── ChatInput.tsx          # Input with voice controls
│   └── gamification/
│       ├── UserProfileCard.tsx    # Avatar, XP, streak, badges
│       └── Leaderboard.tsx        # Top 10 users
│
├── hooks/
│   ├── useD3Sort.ts               # Core D3.js visualization logic
│   ├── useSpeech.ts               # STT + TTS integration
│   └── useSocraticTutor.ts        # AI dialogue orchestration
│
├── store/
│   ├── useAppStore.ts             # Global app state (Zustand)
│   └── useLearnerStore.ts         # User progress state (Zustand)
│
├── context/
│   └── ThemeProvider.tsx          # Light/dark mode provider
│
├── lib/
│   ├── firebase.ts                # Firebase Auth setup
│   ├── prisma.ts                  # Prisma client
│   └── utils.ts                   # Helper functions (pcmToWav)
│
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── dev.db                     # SQLite database file
│
└── backend/                       # Python AI backend
    ├── main.py                    # FastAPI server
    ├── requirements.txt           # Python dependencies
    ├── core/
    │   ├── tutor.py               # LangChain logic
    │   └── prompts.py             # Socratic prompt templates
    └── api/
        └── v1/
            └── chat.py            # /api/v1/chat endpoint
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.11+
- **Firebase Project** (for authentication)
- **Google AI Studio API Key** (for Gemini)

### 1. Clone the Repository

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

# Seed database (optional)
npx prisma db seed
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

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

### 4. Python Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_AI_API_KEY=your_gemini_api_key" > .env
```

### 5. Run the Application

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Python Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Visit `http://localhost:3000` to see the app.

## 🏗️ Architecture

### Data Flow

```
┌─────────────┐
│   Client    │
│  (Next.js)  │
└──────┬──────┘
       │ 1. User sends message
       ▼
┌─────────────────────────────┐
│ Next.js API Route           │
│ /api/chat/send              │
│                             │
│ • Gets Firebase uid         │
│ • Fetches chat history (DB) │
│ • Fetches mastery (DB)      │
└──────┬──────────────────────┘
       │ 2. Orchestration
       ▼
┌─────────────────────────────┐
│ Python FastAPI Backend      │
│ /api/v1/chat                │
│                             │
│ • LangChain + Gemini        │
│ • Generates Socratic Q      │
│ • Updates mastery           │
│ • Returns structured JSON   │
└──────┬──────────────────────┘
       │ 3. AI Response
       ▼
┌─────────────────────────────┐
│ Next.js API Route           │
│ /api/chat/send              │
│                             │
│ • Saves chat to DB          │
│ • Updates mastery in DB     │
│ • Awards XP                 │
└──────┬──────────────────────┘
       │ 4. Returns to client
       ▼
┌─────────────┐
│   Client    │
│  • Updates UI               │
│  • Animates visualizer      │
│  • Plays TTS audio          │
└─────────────┘
```

### Database Schema (Prisma)

```prisma
model User {
  id            String        @id @default(uuid())
  firebaseUid   String        @unique
  email         String        @unique
  displayName   String?
  photoURL      String?
  createdAt     DateTime      @default(now())
  profile       Profile?
  chatHistory   ChatMessage[]
}

model Profile {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  xp            Int      @default(0)
  level         Int      @default(1)
  streak        Int      @default(0)
  lastActive    DateTime @default(now())
  badges        Json     @default("[]")
  mastery       Json     @default("{}")
}

model ChatMessage {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  algorithm     String
  role          String   // "user" | "ai" | "system"
  content       String
  timestamp     DateTime @default(now())
}
```

## 🧩 Key Components

### AI Response Structure

The Python backend returns structured JSON:

```typescript
interface AIResponse {
  socraticQuestion: string;
  analysisOfUserAnswer: string;
  learnerMasteryUpdate: {
    bubbleSort?: number;
    quickSort?: number;
    // ... other algorithms
  };
  visualizerStateUpdate: {
    focusIndices: number[];
    state: "idle" | "comparing" | "swapping" | "sorted";
  };
  xpAwarded: number;
}
```

### Zustand Stores

**useAppStore**:
- Current algorithm selection
- Animation speed
- Mute state
- Loading states

**useLearnerStore**:
- User profile (XP, level, streak)
- Mastery scores per algorithm
- Badges
- Hydrates from `/api/user/profile`

### D3.js Visualization

The `useD3Sort` hook:
1. Creates an SVG canvas
2. Binds data to `<rect>` elements
3. Responds to `visualizerStateUpdate` from AI
4. Animates swaps, comparisons, and sorts
5. Updates colors based on state

## 🎨 Styling Guidelines

- **shadcn/ui** components for all UI elements
- **Tailwind CSS** for custom styling
- **Framer Motion** for page transitions and UI animations
- **D3.js transitions** for data visualizations
- **Theme-aware colors**: Use CSS variables that adapt to dark/light mode

## 🧪 Testing

```bash
# Run frontend tests
npm run test

# Run backend tests
cd backend
pytest
```

## 📦 Deployment

### Frontend (Vercel)

```bash
# Build the app
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Render)

```bash
cd backend
# Deploy using Railway CLI or Render dashboard
```

### Database

For production, consider migrating from SQLite to:
- **PostgreSQL** (recommended for Vercel/Railway)
- **PlanetScale** (MySQL-compatible)

Update `DATABASE_URL` in `.env` and run:
```bash
npx prisma db push
```

## 🔐 Security Considerations

- Firebase Auth tokens are verified on the server
- API keys are stored in environment variables
- CORS is configured to allow only your frontend domain
- Rate limiting on AI endpoints to prevent abuse
- User data is scoped by Firebase UID

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini** for the powerful AI model
- **LangChain** for the elegant AI orchestration framework
- **shadcn/ui** for the beautiful component library
- **D3.js** for the incredible visualization capabilities
- **Vercel** for the amazing Next.js framework

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@socraticsort.com
- Discord: [Join our community](https://discord.gg/socraticsort)

---

**Built with ❤️ by developers who believe learning should be a conversation, not a lecture.**
