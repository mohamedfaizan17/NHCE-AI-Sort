from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import google.generativeai as genai
import json
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class QuizQuestion(BaseModel):
    question: str
    answer: str
    correctAnswer: str
    isCorrect: bool
    category: str

class QuizEvaluationRequest(BaseModel):
    questions: List[QuizQuestion]

@router.post("/evaluate-quiz")
async def evaluate_quiz(request: QuizEvaluationRequest):
    """
    Evaluate user's quiz answers using Gemini AI
    """
    try:
        print(f"📥 Received quiz evaluation request with {len(request.questions)} questions", flush=True)
        
        # Initialize Gemini
        api_key = os.getenv("GOOGLE_AI_API_KEY")
        if not api_key:
            print("❌ API key not configured!", flush=True)
            raise HTTPException(status_code=500, detail="API key not configured")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        print("✅ Gemini model initialized", flush=True)
        
        # Calculate score from MCQ answers
        correct_count = sum(1 for q in request.questions if q.isCorrect)
        total_questions = len(request.questions)
        
        # Determine skill level based on score
        if correct_count <= 3:
            skill_level = "basic"
        elif correct_count <= 6:
            skill_level = "intermediate"
        else:
            skill_level = "advanced"
        
        # Prepare evaluation prompt for feedback
        questions_text = "\n\n".join([
            f"Question {i+1} ({q.category}): {q.question}\n"
            f"User's Answer: {q.answer}\n"
            f"Correct Answer: {q.correctAnswer}\n"
            f"Result: {'✓ Correct' if q.isCorrect else '✗ Incorrect'}"
            for i, q in enumerate(request.questions)
        ])
        
        prompt = f"""You are an expert computer science educator. A student just completed a sorting algorithms quiz.

Quiz Results:
- Score: {correct_count}/{total_questions} correct
- Skill Level: {skill_level}

{questions_text}

Provide brief, encouraging feedback (2-3 sentences) about their performance and what they should focus on to improve.

Respond ONLY with valid JSON in this exact format:
{{
  "score": <number 0-5>,
  "skillLevel": "<basic|intermediate|advanced>",
  "feedback": "<constructive feedback string>",
  "questionScores": [<array of 0 or 1 for each question>]
}}"""

        print("🚀 Calling Gemini for feedback...", flush=True)
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        print(f"✅ Gemini feedback received", flush=True)
        
        # Clean and parse JSON
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        try:
            gemini_response = json.loads(response_text)
            feedback = gemini_response.get("feedback", "Great effort! Keep practicing to improve your understanding.")
        except json.JSONDecodeError:
            # If JSON parsing fails, use the raw text as feedback
            feedback = response_text if len(response_text) < 500 else "Great effort! Keep practicing to improve your understanding."
        
        # Return evaluation with actual score
        evaluation = {
            "score": correct_count,
            "totalQuestions": total_questions,
            "skillLevel": skill_level,
            "feedback": feedback,
            "questionScores": [1 if q.isCorrect else 0 for q in request.questions]
        }
        
        print(f"📊 Evaluation complete: {skill_level} level, score: {correct_count}/{total_questions}", flush=True)
        
        return evaluation
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}", flush=True)
        print(f"Response text: {response_text}", flush=True)
        # Return default evaluation
        return {
            "score": 2,
            "skillLevel": "basic",
            "feedback": "We had trouble evaluating your responses. You've been assigned a basic level to start. You can unlock more features by mastering algorithms!",
            "questionScores": [0] * len(request.questions)
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"🚨 Evaluation error: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
