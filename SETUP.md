# Setup Guide for Socratic Sort

This guide will help you set up the complete Socratic Sort application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** or **pnpm**
- **Python** 3.11 or higher
- **pip** (Python package manager)
- A **Firebase** project
- A **Google AI Studio** API key (for Gemini)

## Step 1: Clone and Install Frontend Dependencies

```bash
# Navigate to project root
cd NHCE-AI

# Install Node.js dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

## Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** > **Sign-in method** > **Google**
4. Go to **Project Settings** > **General** > **Your apps**
5. Click **Add app** > **Web**
6. Copy your Firebase configuration

## Step 3: Set Up Google AI Studio

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Save it securely

## Step 4: Configure Environment Variables

### Frontend (.env.local)

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Database
DATABASE_URL="file:./prisma/dev.db"

# Python Backend
PYTHON_BACKEND_URL=http://localhost:8000

# Google AI (for TTS)
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
GOOGLE_AI_API_KEY=your_gemini_api_key_here
PORT=8000
```

## Step 5: Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create and initialize the database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Step 6: Set Up Python Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 7: Run the Application

You'll need **two terminal windows**:

### Terminal 1: Frontend

```bash
# In the project root
npm run dev
```

The frontend will start at `http://localhost:3000`

### Terminal 2: Python Backend

```bash
# In the backend directory
cd backend

# Activate virtual environment if not already active
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run the FastAPI server
python main.py

# Or with uvicorn directly:
uvicorn main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`

## Step 8: Verify Setup

1. **Frontend**: Visit `http://localhost:3000`
   - You should see the Socratic Sort landing page
   - Click "Continue with Google" to sign in

2. **Backend**: Visit `http://localhost:8000/docs`
   - You should see the FastAPI Swagger documentation
   - Test the `/api/v1/chat` endpoint

3. **Database**: Run `npx prisma studio`
   - You should see your database tables
   - After signing in, check if your user was created

## Troubleshooting

### Frontend Issues

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Database errors:**
```bash
npx prisma generate
npx prisma db push
```

### Backend Issues

**Import errors:**
```bash
# Make sure you're in the virtual environment
pip install -r requirements.txt
```

**CORS errors:**
- Check that `http://localhost:3000` is in the CORS allowed origins in `backend/main.py`

**API key errors:**
- Verify your `.env` file in the `backend/` directory
- Make sure `GOOGLE_AI_API_KEY` is set correctly

### Firebase Auth Issues

**"Auth domain not configured":**
- Check that `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct in `.env.local`
- Verify your Firebase project settings

**"OAuth redirect URI mismatch":**
- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add `localhost` if testing locally

## Next Steps

Once everything is running:

1. **Sign in** with your Google account
2. **Explore** the different sorting algorithms
3. **Start chatting** with Sort-crates
4. **Watch** the visualizations respond to the AI's guidance
5. **Earn XP** and unlock badges!

## Development Tips

### Hot Reload

- **Frontend**: Saved changes auto-refresh the browser
- **Backend**: The `--reload` flag enables auto-restart on file changes

### Debugging

- **Frontend**: Use browser DevTools (F12)
- **Backend**: Check the terminal output for errors
- **Database**: Use Prisma Studio to inspect data

### Code Quality

```bash
# Frontend linting
npm run lint

# Type checking
npx tsc --noEmit
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup instructions.

## Need Help?

- Check the [README.md](./README.md) for more details
- Open an issue on GitHub
- Join our Discord community

---

**Happy Learning! 🎓**
