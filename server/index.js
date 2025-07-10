import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Shaped API configuration
const SHAPED_API_KEY = process.env.SHAPED_API_KEY;
const SHAPED_BASE_URL = 'https://api.shaped.ai';
const SHAPED_MODEL_NAME = process.env.SHAPED_MODEL_NAME || 'hn_personalization';

// In-memory storage for demo purposes (in production, use a database)
const users = new Map();
const engagementEvents = [];

// Helper function to make requests to Shaped API
async function makeShapedRequest(endpoint, method = 'GET', body = null) {
  if (!SHAPED_API_KEY) {
    throw new Error('Shaped API key not configured');
  }

  const response = await fetch(`${SHAPED_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${SHAPED_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Shaped API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple demo authentication
  if (email === 'demo@example.com' && password === 'password') {
    const user = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      preferences: ['technology', 'startups', 'web']
    };
    users.set(user.id, user);
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, preferences } = req.body;
  
  const userId = Date.now().toString();
  const user = {
    id: userId,
    email,
    name,
    preferences: preferences || []
  };
  
  users.set(userId, user);
  res.json({ success: true, user });
});

// Engagement tracking endpoints
app.post('/api/engagement/track', (req, res) => {
  const { userId, storyId, eventType, metadata = {} } = req.body;
  
  const event = {
    id: Date.now().toString(),
    userId,
    storyId,
    eventType, // 'click', 'upvote', 'comment'
    metadata,
    timestamp: new Date().toISOString()
  };
  
  engagementEvents.push(event);
  
  // Send event to Shaped API
  sendEventToShaped(event).catch(console.error);
  
  res.json({ success: true, eventId: event.id });
});

async function sendEventToShaped(event) {
  if (!SHAPED_API_KEY) {
    console.log('Shaped API key not configured, skipping event tracking');
    return;
  }

  try {
    // Map event to Shaped format
    const shapedEvent = {
      user_id: event.userId,
      item_id: event.storyId.toString(),
      event_type: event.eventType,
      timestamp: event.timestamp,
      properties: {
        ...event.metadata,
        story_id: event.storyId
      }
    };

    await makeShapedRequest('/v1/events', 'POST', shapedEvent);
    console.log('Event sent to Shaped:', shapedEvent);
  } catch (error) {
    console.error('Failed to send event to Shaped:', error);
  }
}

// Personalized feed endpoint using Shaped Rank API
app.post('/api/feed/personalized', async (req, res) => {
  const { userId, stories } = req.body;
  
  if (!SHAPED_API_KEY) {
    // Fallback to basic sorting if Shaped is not configured
    const sortedStories = stories.sort((a, b) => b.points - a.points);
    return res.json({ stories: sortedStories });
  }

  try {
    // Get personalized ranking from Shaped Rank API
    const rankingResponse = await makeShapedRequest('/v1/rank', 'POST', {
      model_name: SHAPED_MODEL_NAME,
      user_id: userId,
      limit: stories.length
    });

    console.log('Shaped ranking response:', rankingResponse);

    // Map ranked items back to stories
    const rankedStories = [];
    const storyMap = new Map(stories.map(story => [story.id.toString(), story]));

    if (rankingResponse.ids && rankingResponse.scores) {
      for (let i = 0; i < rankingResponse.ids.length; i++) {
        const itemId = rankingResponse.ids[i];
        const score = rankingResponse.scores[i];
        const story = storyMap.get(itemId);
        
        if (story) {
          rankedStories.push({
            ...story,
            rank_score: score
          });
        }
      }
    }

    // Add any remaining stories that weren't ranked
    stories.forEach(story => {
      if (!rankedStories.find(rs => rs.id === story.id)) {
        rankedStories.push({
          ...story,
          rank_score: 0.1 // Default low score for unranked items
        });
      }
    });

    res.json({ stories: rankedStories });
  } catch (error) {
    console.error('Failed to get personalized ranking:', error);
    // Fallback to basic sorting
    const sortedStories = stories.sort((a, b) => b.points - a.points);
    res.json({ stories: sortedStories });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    shapedConfigured: !!SHAPED_API_KEY,
    shapedModel: SHAPED_MODEL_NAME,
    timestamp: new Date().toISOString()
  });
});

// Shaped model status endpoint
app.get('/api/shaped/status', async (req, res) => {
  if (!SHAPED_API_KEY) {
    return res.json({ 
      configured: false, 
      message: 'Shaped API key not configured' 
    });
  }

  try {
    // Check model status
    const modelResponse = await makeShapedRequest(`/v1/models/${SHAPED_MODEL_NAME}`);
    res.json({
      configured: true,
      model: modelResponse,
      message: 'Shaped API is working'
    });
  } catch (error) {
    res.json({
      configured: true,
      error: error.message,
      message: 'Shaped API configured but model may not be ready'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Shaped API configured: ${!!SHAPED_API_KEY}`);
  console.log(`Shaped model: ${SHAPED_MODEL_NAME}`);
}); 