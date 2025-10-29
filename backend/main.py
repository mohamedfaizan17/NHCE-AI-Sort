"""
FastAPI Backend for Socratic Sort AI Tutor
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routers
from api.v1.chat import router as chat_router
from api.v1.evaluate_quiz import router as quiz_router

# Create FastAPI app
app = FastAPI(
    title="Socratic Sort AI Backend",
    description="LangChain-powered Socratic tutoring for sorting algorithms",
    version="1.0.0",
)

# CORS middleware - Allow all origins for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "Socratic Sort AI Backend",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health():
    """Health check for monitoring."""
    return {"status": "healthy"}


# Include API routes
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])
app.include_router(quiz_router, prefix="/api/v1", tags=["Quiz"])


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )
