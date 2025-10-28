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
from backend.api.v1.chat import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="Socratic Sort AI Backend",
    description="LangChain-powered Socratic tutoring for sorting algorithms",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your production domain
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


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info",
    )
