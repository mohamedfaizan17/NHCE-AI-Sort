import requests
import json

url = "http://localhost:8000/api/v1/chat"
data = {
    "chatHistory": [{"role": "user", "content": "test"}],
    "algorithm": "bubbleSort",
    "learnerMastery": {"bubbleSort": 0.5},
    "currentArray": [1, 2, 3]
}

# Also test health endpoint
health_url = "http://localhost:8000/health"
print("Testing health endpoint...")
health_response = requests.get(health_url)
print(f"Health: {health_response.status_code} - {health_response.text}")

print("Sending request to backend...")
try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(f"Response text: {response.text}")
    if response.status_code == 200:
        print(f"Response JSON: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
