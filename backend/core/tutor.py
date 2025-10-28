"""
LangChain-powered Socratic Tutor
"""

import json
import os
from typing import Dict, List, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from .prompts import get_socratic_prompt


class SocraticTutor:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        # Allow running without external API for local dev/testing
        if not api_key:
            self.llm = None
            self.use_mock = True
        else:
            self.use_mock = False
            self.llm = ChatGroq(
                model="llama-3.3-70b-versatile",
                groq_api_key=api_key,
                temperature=0.7,
            )
    
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
        
        # Format chat history for prompt
        history_str = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in chat_history[-10:]  # Last 10 messages
        ])
        
        # Add array data to context if provided
        if current_array:
            history_str += f"\n\nCURRENT ARRAY BEING SORTED: {current_array}"
        
        # Create system prompt
        system_prompt = get_socratic_prompt(algorithm, current_mastery, history_str)
        
        # Build message chain
        messages = [SystemMessage(content=system_prompt)]
        
        # Add chat history - include AI responses too
        for msg in chat_history[-10:]:  # Last 10 for better context
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "ai" or msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))
        
        # Add instruction for JSON response
        messages.append(
            HumanMessage(
                content="Generate your Socratic response as a valid JSON object following the specified format. Do not include any markdown formatting or additional text."
            )
        )
        
        # If running in mock mode, synthesize a minimal, deterministic response
        if getattr(self, "use_mock", False) or self.llm is None:
            next_mastery = min(1.0, max(0.0, current_mastery + 0.03))
            return {
                "socraticQuestion": "What happens to the largest element after one full pass?",
                "analysisOfUserAnswer": "continuing",
                "learnerMasteryUpdate": {algorithm: next_mastery},
                "visualizerStateUpdate": {"focusIndices": [0, 1], "state": "comparing"},
                "xpAwarded": 5,
            }

        try:
            # Invoke LLM
            response = self.llm.invoke(messages)
            response_text = response.content.strip()
            
            # Remove markdown code fences if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON response
            parsed_response = json.loads(response_text)
            
            # Validate and set defaults
            result = {
                "socraticQuestion": parsed_response.get(
                    "socraticQuestion",
                    "Great observation! Can you explain your reasoning further?"
                ),
                "analysisOfUserAnswer": parsed_response.get(
                    "analysisOfUserAnswer", "continuing"
                ),
                "learnerMasteryUpdate": parsed_response.get(
                    "learnerMasteryUpdate", {algorithm: current_mastery}
                ),
                "visualizerStateUpdate": parsed_response.get(
                    "visualizerStateUpdate",
                    {"focusIndices": [], "state": "idle"}
                ),
                "xpAwarded": parsed_response.get("xpAwarded", 5),
            }
            
            return result
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response text: {response_text}")
            # Fallback response
            return {
                "socraticQuestion": "That's an interesting point! Can you elaborate on your thinking?",
                "analysisOfUserAnswer": "continuing",
                "learnerMasteryUpdate": {algorithm: current_mastery},
                "visualizerStateUpdate": {"focusIndices": [], "state": "idle"},
                "xpAwarded": 5,
            }
        
        except Exception as e:
            print(f"Error generating response: {e}")
            print(f"Error type: {type(e)}")
            import traceback
            traceback.print_exc()
            # Fallback response
            return {
                "socraticQuestion": "Let's continue exploring. What aspect would you like to understand better?",
                "analysisOfUserAnswer": "continuing",
                "learnerMasteryUpdate": {algorithm: current_mastery},
                "visualizerStateUpdate": {"focusIndices": [], "state": "idle"},
                "xpAwarded": 5,
            }
