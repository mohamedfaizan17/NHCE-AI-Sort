import requests
import json

try:
    # Test health endpoint
    print("Testing health on port 8001...")
    response = requests.get("http://localhost:8001/health", timeout=5)
    print(f"Health: {response.status_code} - {response.text}")
    
    # Test chat endpoint
    print("Testing chat on port 8001...")
    data = {
        "chatHistory": [{"role": "user", "content": "hi"}],
        "algorithm": "bubbleSort", 
        "learnerMastery": {"bubbleSort": 0.5},
        "currentArray": [3, 1, 2]
    }
    
    response = requests.post("http://localhost:8001/api/v1/chat", json=data, timeout=5)
    print(f"Chat: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {response.json()}")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Connection error: {e}")
