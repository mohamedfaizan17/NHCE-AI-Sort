// Test 5 chat prompts with the new API key
const testPrompts = [
  "What is bubble sort?",
  "How does it compare elements?",
  "When should we swap?",
  "What happens after one pass?",
  "How many passes are needed?"
];

const testChat = async () => {
  console.log('🧪 Testing 5 prompts with new Gemini API key...\n');

  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📝 Prompt ${i + 1}: "${prompt}"`);
    console.log('='.repeat(60));

    const payload = {
      message: prompt,
      algorithm: "bubbleSort",
      firebaseUid: "test-user-123",
      currentArray: [5, 2, 8, 1, 9]
    };

    try {
      const startTime = Date.now();
      const response = await fetch('http://localhost:3000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      if (!response.ok) {
        console.log(`❌ Failed (${response.status}) - ${duration}s`);
        const error = await response.json();
        console.log('Error:', error);
        continue;
      }

      const data = await response.json();
      
      console.log(`✅ Success - ${duration}s`);
      console.log('\n📤 AI Response:');
      console.log(data.socraticQuestion);
      console.log('\n📊 Stats:');
      console.log(`  - XP Awarded: ${data.xpAwarded}`);
      console.log(`  - Analysis: ${data.analysisOfUserAnswer}`);
      console.log(`  - Mastery Update:`, data.learnerMasteryUpdate);
      if (data.newBadges && data.newBadges.length > 0) {
        console.log(`  - 🏆 New Badges:`, data.newBadges);
      }

      // Wait 1 second between requests
      if (i < testPrompts.length - 1) {
        console.log('\n⏳ Waiting 1 second before next prompt...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`\n❌ Error:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ All 5 prompts tested!');
  console.log('='.repeat(60));
};

testChat();
