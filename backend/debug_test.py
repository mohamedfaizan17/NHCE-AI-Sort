from core.tutor import SocraticTutor

print("Creating tutor...")
tutor = SocraticTutor()

print("Testing generate_response...")
response = tutor.generate_response(
    algorithm="bubbleSort",
    chat_history=[{"role": "user", "content": "hi"}],
    learner_mastery={"bubbleSort": 0.5},
    current_array=[3, 1, 2]
)

print(f"Response: {response}")
