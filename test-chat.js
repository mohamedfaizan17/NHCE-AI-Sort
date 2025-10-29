// Test chat API
const testChat = async () => {
  console.log('🧪 Testing chat API...\n');

  const payload = {
    message: "How does bubble sort work?",
    algorithm: "bubbleSort",
    firebaseUid: "test-user-123",
    currentArray: [5, 2, 8, 1, 9]
  };

  console.log('📤 Sending request:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch('http://localhost:3000/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('\n📊 Response status:', response.status);
    
    const data = await response.json();
    console.log('\n📥 Response data:', JSON.stringify(data, null, 2));

    if (data.socraticQuestion) {
      console.log('\n✅ SUCCESS! AI responded with:');
      console.log(data.socraticQuestion);
      console.log('\n🎯 XP Awarded:', data.xpAwarded);
      if (data.newBadges && data.newBadges.length > 0) {
        console.log('🏆 New Badges:', data.newBadges);
      }
    } else {
      console.log('\n❌ FAILED:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
};

testChat();
