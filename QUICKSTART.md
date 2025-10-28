# Socratic Sort - Quick Start Guide

Welcome! This guide will get you up and running in **5 minutes**.

## Prerequisites

- Node.js 18+
- Python 3.11+
- Firebase account
- Google AI Studio API key

## 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

## 2. Configure Environment

Create `.env.local` in root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
DATABASE_URL="file:./prisma/dev.db"
PYTHON_BACKEND_URL=http://localhost:8000
GOOGLE_AI_API_KEY=your_gemini_key
```

Create `backend/.env`:
```env
GOOGLE_AI_API_KEY=your_gemini_key
PORT=8000
```

## 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

## 4. Run the App

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

## 5. Open & Test

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

## That's it! 🎉

Sign in with Google and start learning!

For detailed setup, see [SETUP.md](./SETUP.md)
