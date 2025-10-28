"""
Chat API endpoint for Socratic tutor
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from core.tutor import SocraticTutor

router = APIRouter()
tutor = SocraticTutor()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    chatHistory: List[ChatMessage]
    algorithm: str
    learnerMastery: Dict[str, float]
    currentArray: List[int] = []


class ChatResponse(BaseModel):
    socraticQuestion: str
    analysisOfUserAnswer: str
    learnerMasteryUpdate: Dict[str, float]
    visualizerStateUpdate: Dict[str, Any]
    xpAwarded: int


@router.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    """
    Process a chat message and return Socratic guidance.
    """
    try:
        print(f"\n=== CHAT ENDPOINT CALLED ===")
        print(f"Request: {request}")
        
        # Convert Pydantic models to dicts
        chat_history = [
            {"role": msg.role, "content": msg.content}
            for msg in request.chatHistory
        ]
        
        print(f"Chat history converted: {chat_history}")
        print(f"Current array: {request.currentArray}")
        
        # Generate response using the tutor
        response = tutor.generate_response(
            algorithm=request.algorithm,
            chat_history=chat_history,
            learner_mastery=request.learnerMastery,
            current_array=request.currentArray if request.currentArray else None,
        )
        
        print(f"Response generated: {response}")
        
        return ChatResponse(**response)
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
