import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_AI_API_KEY")
print(f"API Key loaded: {bool(api_key)}")
print(f"API Key: {api_key[:10]}..." if api_key else "No key")

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    
    print("Initializing Gemini...")
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0.7,
    )
    print("Gemini initialized successfully!")
    
    # Test a simple message
    print("Testing message...")
    from langchain_core.messages import HumanMessage
    response = llm.invoke([HumanMessage(content="Say hello")])
    print(f"Response: {response.content}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
