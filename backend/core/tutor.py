"""
LangChain-powered Socratic Tutor
"""

import json
import os
from typing import Dict, List, Any
from dotenv import load_dotenv
import google.generativeai as genai
from .prompts import get_socratic_prompt

# Load environment variables
load_dotenv()


class SocraticTutor:
    def __init__(self):
        api_key = os.getenv("GOOGLE_AI_API_KEY")
        print(f"GOOGLE_AI_API_KEY loaded: {bool(api_key)}", flush=True)
        print(f"API key length: {len(api_key) if api_key else 0}", flush=True)
        
        # Use Gemini 1.5 Flash - Higher free tier quota (1500 RPD)
        print("Initializing Google Gemini 1.5 Flash...", flush=True)
        genai.configure(api_key=api_key)
        self.llm = genai.GenerativeModel('gemini-2.5-flash')
        print("Google Gemini 1.5 Flash initialized successfully", flush=True)
    
    def generate_response(
        self,
        algorithm: str,
        chat_history: List[Dict[str, str]],
        learner_mastery: Dict[str, float],
        current_array: List[int] = None,
    ) -> Dict[str, Any]:
        """
        Generate a Socratic response using LangChain and Gemini.
        
        Args:
            algorithm: The current sorting algorithm (e.g., "bubbleSort")
            chat_history: List of recent messages [{"role": "user/ai", "content": "..."}]
            learner_mastery: Dictionary of mastery levels per algorithm
        
        Returns:
            Dictionary containing the AI's structured response
        """
        print(f"\n=== GENERATE RESPONSE CALLED ===")
        print(f"Algorithm: {algorithm}")
        print(f"Chat history: {chat_history}")
        print(f"Current array: {current_array}")
        print(f"Use mock: {getattr(self, 'use_mock', False)}")
        print(f"LLM exists: {self.llm is not None}")
        
        # Get current mastery for this algorithm
        current_mastery = learner_mastery.get(algorithm, 0.0)
        
        # Format chat history for prompt (reduced to 5 for speed)
        history_str = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in chat_history[-5:]  # Last 5 messages only
        ])
        
        # Add array data to context if provided
        if current_array:
            history_str += f"\n\nCURRENT ARRAY: {current_array}"
        
        # Create system prompt
        system_prompt = get_socratic_prompt(algorithm, current_mastery, history_str)
        
        # Build prompt with chat history
        full_prompt = system_prompt + "\n\n"
        
        # Add chat history (only last 5)
        for msg in chat_history[-5:]:
            if msg["role"] == "user":
                full_prompt += f"USER: {msg['content']}\n"
            elif msg["role"] == "ai" or msg["role"] == "assistant":
                full_prompt += f"ASSISTANT: {msg['content']}\n"
        
        # Add instruction for JSON response
        full_prompt += "\nGenerate your Socratic response as a valid JSON object following the specified format. Do not include any markdown formatting or additional text."
        
        try:
            # Call Gemini API directly - NO TIMEOUTS OR FALLBACKS
            print("🚀 Calling Gemini 2.5 Flash...", flush=True)
            response = self.llm.generate_content(full_prompt)
            response_text = response.text.strip()
            print("✅ Gemini response received", flush=True)
            
            print(f"Raw LLM response: {response_text[:500]}...")  # Log first 500 chars
            
            # Try to extract JSON from the response
            # Sometimes LLM adds extra text before/after JSON
            json_start = response_text.find('{')
            json_end = response_text.rfind('}')
            
            if json_start != -1 and json_end != -1:
                response_text = response_text[json_start:json_end + 1]
                
            # Remove markdown code fences if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            print(f"Cleaned response: {response_text[:500]}...")  # Log cleaned version
            
            # Parse JSON response
            parsed_response = json.loads(response_text)
            print(f"Successfully parsed JSON response")
            
            # Validate and set defaults with deterministic XP awarding
            analysis = parsed_response.get("analysisOfUserAnswer", "continuing")

            # Award XP strictly: 5 for correct responses, otherwise 0
            xp_awarded = 5 if analysis == "correct" else 0

            # Get visualizer state update
            visualizer_update = parsed_response.get(
                "visualizerStateUpdate",
                {"focusIndices": [], "state": "idle"}
            )
            
            # Log the visualizer update for debugging
            print(f"📊 Visualizer update from AI: {visualizer_update}", flush=True)
            if "data" in visualizer_update:
                print(f"✅ AI provided new array data: {visualizer_update['data']}", flush=True)
            else:
                print(f"⚠️ No array data in visualizer update", flush=True)

            result = {
                "socraticQuestion": parsed_response.get(
                    "socraticQuestion",
                    "Great observation! Can you explain your reasoning further?"
                ),
                "analysisOfUserAnswer": analysis,
                "learnerMasteryUpdate": parsed_response.get(
                    "learnerMasteryUpdate", {algorithm: current_mastery}
                ),
                "visualizerStateUpdate": visualizer_update,
                "xpAwarded": xp_awarded,
            }
            
            print(f"🎯 Final result being returned: {result}", flush=True)
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}", flush=True)
            print(f"Response text: {response_text}", flush=True)
            # Fallback response
            return {
                "socraticQuestion": "That's an interesting point! Can you elaborate on your thinking?",
                "analysisOfUserAnswer": "continuing",
                "learnerMasteryUpdate": {algorithm: current_mastery},
                "visualizerStateUpdate": {"focusIndices": [], "state": "idle"},
                "xpAwarded": 0,
            }
        
        except Exception as e:
            print(f"🚨 GEMINI API ERROR: {e}", flush=True)
            print(f"Error type: {type(e)}", flush=True)
            
            # Check if it's a quota/rate limit error
            error_str = str(e).lower()
            if "quota" in error_str or "rate limit" in error_str or "429" in error_str:
                print("💸 Rate limit hit - API quota exceeded", flush=True)
            elif "timeout" in error_str:
                print("⏰ API call timed out", flush=True)
            elif "network" in error_str or "connection" in error_str:
                print("🌐 Network connection issue", flush=True)
            else:
                print("❓ Unknown API error", flush=True)
            
            import traceback
            traceback.print_exc()
            
            # Return a more specific error response
            return {
                "socraticQuestion": f"I'm experiencing a technical issue. Let's continue with {algorithm.replace('Sort', ' Sort')} - what would you like to explore about this algorithm?",
                "analysisOfUserAnswer": "continuing",
                "learnerMasteryUpdate": {algorithm: current_mastery},
                "visualizerStateUpdate": {"focusIndices": [], "state": "idle"},
                "xpAwarded": 0,
            }
