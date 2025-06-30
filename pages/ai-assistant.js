// pages/ai-assistant.js

import { useState } from 'react';
import axios from 'axios';

const AiAssistant = () => {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleRecommend = async () => {
    const response = await axios.post('/api/ai/recommend', { interests: interests.split(',') });
    setRecommendations(response.data);
  };

  return (
    <div>
      <h1>AI Assistant</h1>
      <textarea value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Enter your interests..." />
      <button onClick={handleRecommend}>Get Recommendations</button>
      <div>
        <h2>Recommended Courses:</h2>
        <p>{recommendations}</p>
      </div>
    </div>
  );
};

export default AiAssistant;
