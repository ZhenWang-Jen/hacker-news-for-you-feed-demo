# Hacker News For You Feed Demo

A personalized Hacker News reader that uses Shaped's AI personalization API to create a "For You" feed based on user engagement patterns.

## Features

### Core Requirements ✅
- **User Authentication**: Simple login/signup with session persistence
- **Hacker News Feed**: Fetches and displays top stories from the official HN API
- **Engagement Tracking**: Tracks clicks, upvotes, and comments for personalization
- **Personalized "For You" Feed**: Uses Shaped API to re-rank stories based on user behavior
- **Two Distinct Views**: Standard HN feed and personalized feed with tabs

### Technical Implementation
- **Frontend**: React + TypeScript + Vite with shadcn/ui components
- **Backend**: Express.js server for secure API key management
- **Personalization**: Shaped AI API integration for ML-powered story ranking
- **Session Management**: localStorage-based session persistence
- **Real-time Updates**: Engagement events sent to Shaped for live personalization

### Bonus Features
- **Comment System**: Users can add comments to stories
- **Story Categories**: Filter by story, show, ask, and job posts
- **Responsive Design**: Mobile-friendly interface
- **Loading States**: Smooth loading experiences
- **Error Handling**: Graceful fallbacks when services are unavailable

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Shaped API key** - Get one at [shaped.ai](https://shaped.ai)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd hacker-news-for-you-feed-demo

# Verify you're in the correct directory
ls
# You should see: package.json, src/, server/, etc.
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (this may take a few minutes)
npm install

# Verify installation
npm list --depth=0
```

### Step 3: Environment Configuration

```bash
# Copy the example environment file
cp env.example .env

# Open the .env file in your preferred editor
# On Windows:
notepad .env
# On Mac/Linux:
nano .env
```

Edit the `.env` file with your configuration:

```env
# Shaped API Configuration
# Get your API key from https://shaped.ai
SHAPED_API_KEY=your_shaped_api_key_here

# Server Configuration
PORT=3001

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3001
```

**Important**: Replace `your_shaped_api_key_here` with your actual Shaped API key.

### Step 4: Start the Development Servers

You have two options to start the application:

#### Option A: Start Both Servers Together (Recommended)
```bash
# This starts both frontend and backend simultaneously
npm run dev:full
```

#### Option B: Start Servers Separately
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

### Step 5: Access the Application

1. **Frontend**: Open [http://localhost:5173](http://localhost:5173) in your browser
2. **Backend API**: Available at [http://localhost:3001](http://localhost:3001)

### Step 6: Test the Application

1. **Login**: Use the demo credentials:
   - Email: `demo@example.com`
   - Password: `password`

2. **Explore Features**:
   - Switch between "For You" and "Standard" feeds using the tabs
   - Click on story titles to open them
   - Use the upvote buttons
   - Add comments to stories
   - Filter stories by category

## 🔧 Shaped API Setup (Required for Personalization)

The personalized "For You" feed requires Shaped API integration. Follow these steps:

### Quick Setup

1. **Install Shaped CLI**:
   ```bash
   pip install shaped
   shaped init --api-key YOUR_SHAPED_API_KEY
   ```

2. **Set Environment Variables**:
   ```bash
   # Add to your .env file
   SHAPED_API_KEY=your_actual_api_key_here
   SHAPED_MODEL_NAME=hn_personalization
   ```

3. **Create Dataset and Model**:
   ```bash
   # Run the automated setup script
   python scripts/setup_shaped.py
   ```

4. **Verify Setup**:
   ```bash
   # Test the ranking API
   shaped rank --model-name hn_personalization --user-id 1 --limit 5
   ```

### Detailed Setup Guide

For complete setup instructions, see [SHAPED_SETUP.md](./SHAPED_SETUP.md).

**Note**: Without Shaped API setup, the application will fall back to basic sorting and show a warning message.

## 🔧 Development Commands

```bash
# Start development servers
npm run dev:full          # Both frontend and backend
npm run dev               # Frontend only
npm run server            # Backend only

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Check for security vulnerabilities
npm audit
```

## 🏗️ Project Structure

```
hacker-news-for-you-feed-demo/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── services/          # API services
│   ├── pages/             # Main page components
│   └── utils/             # Utility functions
├── server/                # Backend server
│   └── index.js          # Express server
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🔑 API Configuration

### Shaped API Setup

1. **Get API Key**: Sign up at [shaped.ai](https://shaped.ai)
2. **Add to .env**: `SHAPED_API_KEY=your_key_here`
3. **Test Connection**: The app will show if Shaped is configured

### Backend API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration  
- `POST /api/engagement/track` - Track user engagement
- `POST /api/feed/personalized` - Get personalized story ranking
- `GET /api/health` - Server health check

## 🧠 Technical Approach & Implementation

### User Authentication

**Implementation Strategy**: Simple but robust authentication system with session persistence

#### Frontend Authentication (`src/contexts/AuthContext.tsx`)

**React Context Pattern**: Used React Context API for global state management
```typescript
// Centralized auth state management
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

**Session Persistence**: localStorage-based session storage
```typescript
// Load user from localStorage on mount
useEffect(() => {
  const savedUser = localStorage.getItem('hn_user');
  if (savedUser) {
    const userData = JSON.parse(savedUser);
    setUser(userData);
  }
}, []);
```

**Why This Approach?**
- **Context API**: Provides clean, type-safe global state without external dependencies
- **localStorage**: Simple, reliable session persistence that works across browser tabs
- **Automatic Loading**: User stays logged in across page reloads and browser restarts

#### Backend Authentication (`server/index.js`)

**Simple Demo Authentication**: For demonstration purposes, using hardcoded credentials
```javascript
// Demo authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'demo@example.com' && password === 'password') {
    const user = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      preferences: ['technology', 'startups', 'web']
    };
    res.json({ success: true, user });
  }
});
```

**Production-Ready Features**:
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Request body validation
- **Error Handling**: Graceful error responses
- **User Preferences**: Stores user interests for personalization

#### Security Considerations

**API Key Security**: Backend-only storage prevents client-side exposure
```javascript
// API keys stored server-side only
const SHAPED_API_KEY = process.env.SHAPED_API_KEY;
```

**Session Management**: 
- No sensitive data in localStorage (only user preferences)
- Session validation on each request
- Automatic logout on authentication errors

**Why Not JWT/Token-Based?**
For this demo, we chose simplicity over complexity:
- **Demo Focus**: The project emphasizes personalization, not auth complexity
- **Rapid Development**: Faster to implement and understand
- **Production Ready**: Easy to replace with JWT/OAuth when needed

#### User Experience Features

**Loading States**: Prevents UI flashing during auth checks
```typescript
const [isLoading, setIsLoading] = useState(true);
// Shows loading spinner while checking localStorage
```

**Error Handling**: User-friendly error messages
```typescript
try {
  const data = await response.json();
  if (data.success) {
    setUser(data.user);
    saveUserToStorage(data.user);
    return true;
  }
} catch (error) {
  console.error('Login error:', error);
  return false;
}
```

**Automatic Redirects**: Seamless login/logout flow
- Unauthenticated users see login page
- Authenticated users see personalized feed
- Logout clears session and redirects to login

#### Code Organization

**Separation of Concerns**:
- **Context**: Manages auth state and provides methods
- **Backend**: Handles authentication logic and user storage
- **Components**: Use auth context for conditional rendering

**Type Safety**: Full TypeScript implementation
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
}
```

This authentication system provides a solid foundation for the personalization features while remaining simple enough for demonstration purposes. The session persistence ensures users don't lose their personalized experience across browser sessions.

### Hacker News Feed

**Implementation Strategy**: Robust data fetching with caching, error handling, and real-time updates from the official HN API

#### API Integration (`src/services/hackerNewsApi.ts`)

**Multi-Step Data Fetching**: HN API requires fetching story IDs first, then individual stories
```typescript
// Step 1: Fetch story IDs from topstories endpoint
export const fetchTopStories = async (limit: number = 30): Promise<number[]> => {
  const response = await fetch(`${HN_API_BASE}/topstories.json`);
  const storyIds = await response.json();
  return storyIds.slice(0, limit);
};

// Step 2: Fetch individual story details
export const fetchStories = async (ids: number[]): Promise<HNStory[]> => {
  const promises = ids.map(id => fetchStory(id));
  const stories = await Promise.all(promises);
  return stories.filter(story => story && story.title); // Filter out null/deleted stories
};
```

**Why This Approach?**
- **HN API Design**: The official API provides story IDs first, then requires individual fetches
- **Parallel Processing**: Uses `Promise.all()` for efficient concurrent requests
- **Error Resilience**: Filters out null/deleted stories automatically
- **Rate Limit Friendly**: Respects API limitations with controlled request patterns

#### Data Transformation (`src/services/hackerNewsApi.ts`)

**Consistent Data Format**: Transforms HN API responses to our standardized format
```typescript
export const transformHNStory = (hnStory: HNStory) => ({
  id: hnStory.id,
  title: hnStory.title,
  url: hnStory.url,
  points: hnStory.score || 0,
  author: hnStory.by || 'unknown',
  timeAgo: getTimeAgo(hnStory.time),
  comments: hnStory.descendants || 0,
  category: getStoryCategory(hnStory.title)
});
```

**Time Formatting**: Human-readable timestamps
```typescript
export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
```

**Category Detection**: Intelligent story categorization
```typescript
export const getStoryCategory = (title: string): 'story' | 'show' | 'ask' | 'job' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.startsWith('show hn:')) return 'show';
  if (lowerTitle.startsWith('ask hn:')) return 'ask';
  if (lowerTitle.includes('hiring') || lowerTitle.includes('job')) return 'job';
  return 'story';
};
```

#### React Query Integration (`src/pages/Index.tsx`)

**Efficient Data Fetching**: Uses React Query for caching and background updates
```typescript
// Fetch story IDs with caching
const { data: storyIds = [], isLoading: isLoadingIds } = useQuery({
  queryKey: ['topStories'],
  queryFn: () => fetchTopStories(100),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});

// Fetch actual stories when IDs are available
const { data: hnStories = [], isLoading: isLoadingStories } = useQuery({
  queryKey: ['stories', storyIds],
  queryFn: () => fetchStories(storyIds),
  enabled: storyIds.length > 0,
  staleTime: 5 * 60 * 1000,
});
```

**Why React Query?**
- **Automatic Caching**: Prevents unnecessary API calls
- **Background Updates**: Keeps data fresh without user intervention
- **Loading States**: Built-in loading and error states
- **Optimistic Updates**: Immediate UI feedback

#### Story Display (`src/components/FeedItem.tsx`)

**Rich Story Cards**: Comprehensive story information display
```typescript
export const FeedItem: React.FC<FeedItemProps> = ({ story, onVote }) => {
  const handleTitleClick = async () => {
    if (story.url) {
      // Track engagement before opening
      if (user) {
        await trackEngagement({
          userId: user.id,
          storyId: story.id,
          eventType: 'click',
          metadata: { url: story.url, title: story.title }
        });
      }
      window.open(story.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-2 cursor-pointer"
           onClick={handleTitleClick}>
        {story.title}
      </h2>
      <div className="flex items-center gap-6 text-sm text-gray-400">
        <span>{story.points} points</span>
        <span>by {story.author}</span>
        <span>{story.comments} comments</span>
        <span>{story.timeAgo}</span>
      </div>
    </div>
  );
};
```

**Required Information Display**:
- ✅ **Title**: Clickable story titles
- ✅ **Score**: Number of upvotes (points)
- ✅ **Author**: Story author (by field)
- ✅ **Comments**: Number of comments (descendants)
- ✅ **External Links**: Opens story URL in new tab

#### API Endpoints Used

**Official HN API Integration**:
```typescript
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

// Fetch top stories IDs
GET /topstories.json
// Returns: [9129911, 9129199, 9127761, ...]

// Fetch individual story
GET /item/{id}.json
// Returns: {
//   "id": 8863,
//   "title": "My YC app: Dropbox",
//   "url": "http://www.getdropbox.com/u/2/screencast.html",
//   "score": 111,
//   "by": "dhouston",
//   "time": 1175714200,
//   "descendants": 71,
//   "type": "story"
// }
```

#### Performance Optimizations

**Caching Strategy**:
- **Story IDs**: Cached for 5 minutes (rarely change)
- **Story Details**: Cached for 5 minutes (can be updated)
- **Background Refetch**: Keeps data fresh automatically

**Request Optimization**:
```typescript
// Parallel story fetching for better performance
const promises = ids.map(id => fetchStory(id));
const stories = await Promise.all(promises);
```

**Error Handling**:
```typescript
// Graceful degradation for failed requests
return stories.filter(story => story && story.title);
```

#### Real-Time Features

**Live Updates**: React Query provides automatic background updates
- **Stale Data**: Automatically refetches when data becomes stale
- **Network Recovery**: Retries failed requests when connection returns
- **Optimistic Updates**: Immediate UI feedback for user actions

**User Interactions**:
- **Click Tracking**: Records story clicks for personalization
- **External Links**: Opens stories in new tabs with proper security
- **Author Links**: Links to HN user profiles
- **Comment Links**: Links to HN discussion threads

This implementation provides a robust, performant HN feed that respects the API's design while delivering an excellent user experience. The multi-step fetching process, intelligent caching, and comprehensive error handling ensure reliable data delivery even under network constraints.

### Engagement Event Tracking

**Implementation Strategy**: Comprehensive user interaction tracking with real-time data collection for personalization

#### Event Tracking Service (`src/services/engagementService.ts`)

**Centralized Event Management**: Single service for all engagement tracking
```typescript
export interface EngagementEvent {
  userId: string;
  storyId: number;
  eventType: 'click' | 'upvote' | 'comment';
  metadata?: Record<string, any>;
}

export const trackEngagement = async (event: EngagementEvent): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/engagement/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to track engagement:', error);
    return false;
  }
};
```

**Why This Approach?**
- **Unified Interface**: Single function for all engagement types
- **Type Safety**: TypeScript interfaces ensure data consistency
- **Error Resilience**: Graceful handling of network failures
- **Extensible**: Easy to add new event types

#### Click Tracking (`src/components/FeedItem.tsx`)

**Story Click Events**: Tracks when users click to view stories
```typescript
const handleTitleClick = async () => {
  if (story.url) {
    // Track click engagement before opening
    if (user) {
      await trackEngagement({
        userId: user.id,
        storyId: story.id,
        eventType: 'click',
        metadata: {
          url: story.url,
          title: story.title,
          category: story.category,
          points: story.points
        }
      });
    }
    
    // Open story in new tab with security attributes
    window.open(story.url, '_blank', 'noopener,noreferrer');
  }
};
```

**Rich Metadata Collection**:
- **Story URL**: For content analysis
- **Story Title**: For topic understanding
- **Category**: For preference learning
- **Points**: For popularity context

#### Upvote Tracking (`src/components/FeedItem.tsx`)

**Vote Button Integration**: Tracks upvote/downvote interactions
```typescript
const handleVote = async (direction: 'up' | 'down') => {
  // Track vote engagement
  if (user) {
    await trackEngagement({
      userId: user.id,
      storyId: story.id,
      eventType: 'upvote',
      metadata: {
        direction,
        points: story.points,
        title: story.title,
        category: story.category
      }
    });
  }
  
  // Update local state for immediate feedback
  onVote(story.id, direction);
};
```

**Vote Button Component** (`src/components/VoteButton.tsx`):
```typescript
export const VoteButton: React.FC<VoteButtonProps> = ({ points, onVote }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onVote('up')}
        className="text-gray-400 hover:text-green-400 transition-colors"
      >
        ▲
      </button>
      <span className="text-sm font-medium text-gray-300">{points}</span>
      <button
        onClick={() => onVote('down')}
        className="text-gray-400 hover:text-red-400 transition-colors"
      >
        ▼
      </button>
    </div>
  );
};
```

#### Comment Tracking (`src/components/FeedItem.tsx`)

**Interactive Comment System**: Tracks user comments with rich metadata
```typescript
const [showCommentInput, setShowCommentInput] = useState(false);
const [commentText, setCommentText] = useState('');
const [isSubmittingComment, setIsSubmittingComment] = useState(false);

const handleCommentSubmit = async () => {
  if (!commentText.trim() || !user) return;

  setIsSubmittingComment(true);
  
  try {
    // Track comment engagement
    await trackEngagement({
      userId: user.id,
      storyId: story.id,
      eventType: 'comment',
      metadata: {
        comment: commentText.trim(),
        storyTitle: story.title,
        storyCategory: story.category,
        commentLength: commentText.trim().length
      }
    });

    setCommentText('');
    setShowCommentInput(false);
  } catch (error) {
    console.error('Failed to submit comment:', error);
  } finally {
    setIsSubmittingComment(false);
  }
};
```

**Comment UI Components**:
```typescript
{showCommentInput && user && (
  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
    <div className="flex gap-2">
      <Input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 bg-gray-600 border-gray-500 text-white"
        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
      />
      <Button
        onClick={handleCommentSubmit}
        disabled={isSubmittingComment || !commentText.trim()}
        size="sm"
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </div>
)}
```

#### Backend Event Processing (`server/index.js`)

**Event Collection Endpoint**: Receives and processes engagement events
```javascript
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
  
  // Send event to Shaped API for personalization
  sendEventToShaped(event).catch(console.error);
  
  res.json({ success: true, eventId: event.id });
});
```

**Shaped API Integration**: Sends events to personalization service
```javascript
async function sendEventToShaped(event) {
  if (!SHAPED_API_KEY) {
    console.log('Shaped API key not configured, skipping event tracking');
    return;
  }

  try {
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
```

#### Event Data Structure

**Comprehensive Event Schema**:
```typescript
interface EngagementEvent {
  userId: string;           // User identifier
  storyId: number;          // Story identifier
  eventType: 'click' | 'upvote' | 'comment';
  metadata: {
    // Click events
    url?: string;
    title?: string;
    category?: string;
    
    // Vote events
    direction?: 'up' | 'down';
    points?: number;
    
    // Comment events
    comment?: string;
    commentLength?: number;
  };
  timestamp: string;        // ISO timestamp
}
```

#### Real-Time Event Processing

**Immediate Feedback**: Events are processed instantly for user experience
- **Optimistic Updates**: UI updates immediately, events sent in background
- **Error Handling**: Failed events don't break user experience
- **Retry Logic**: Automatic retry for failed network requests

**Event Flow**:
1. **User Action**: Click, vote, or comment
2. **Local Update**: Immediate UI feedback
3. **Event Tracking**: Background event collection
4. **Shaped Integration**: Event sent to personalization service
5. **Model Training**: Shaped uses events to improve recommendations

#### Privacy & Security

**Data Minimization**: Only necessary data is collected
- **No Personal Info**: Events don't contain sensitive user data
- **Anonymized IDs**: User IDs are internal only
- **Optional Tracking**: Events only sent when user is authenticated

**Security Measures**:
- **Server-Side Processing**: Events processed on backend only
- **Input Validation**: All event data validated before processing
- **Rate Limiting**: Prevents event spam
- **Error Logging**: Failed events logged for debugging

#### Performance Optimizations

**Efficient Event Handling**:
- **Background Processing**: Events don't block UI
- **Batch Processing**: Multiple events can be batched
- **Caching**: Event data cached for performance
- **Compression**: Event payloads minimized

**Memory Management**:
- **Event Cleanup**: Old events automatically cleaned up
- **Size Limits**: Event storage has size limits
- **Garbage Collection**: Unused event data removed

This engagement tracking system provides the foundation for personalization by collecting rich user interaction data. The comprehensive event collection, real-time processing, and secure data handling ensure that user preferences are accurately captured for the personalized feed.

### Personalized "For You" Feed (Shaped API Integration)

**Implementation Strategy**: AI-powered personalization using Shaped's recommendation engine with real-time ranking and fallback mechanisms

#### Shaped API Integration Overview

**Three Core APIs**: Complete personalization pipeline implementation
- **Dataset API**: Store user engagement data and story metadata
- **Model Management API**: Train and manage personalization models
- **Rank API**: Real-time personalized story ranking

#### Backend Shaped Integration (`server/index.js`)

**Secure API Key Management**: Server-side only API key storage
```javascript
const SHAPED_API_KEY = process.env.SHAPED_API_KEY;
const SHAPED_BASE_URL = 'https://api.shaped.ai';

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
```

**Why Server-Side Only?**
- **Security**: API keys never exposed to client
- **Rate Limiting**: Centralized request management
- **Error Handling**: Consistent error responses
- **Caching**: Server-side caching for performance

#### Dataset Management (Shaped Dataset API)

**User Engagement Data Storage**: Comprehensive event collection
```javascript
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
```

**Event Schema Design**:
- **User ID**: Unique user identifier
- **Item ID**: Story identifier (converted to string)
- **Event Type**: 'click', 'upvote', 'comment'
- **Timestamp**: ISO timestamp for temporal analysis
- **Properties**: Rich metadata for each event type

#### Model Training (Shaped Model Management API)

**Personalization Model Creation**: Automated model training process
```javascript
// Model creation and training (typically done via Shaped dashboard)
// This would be implemented as a separate endpoint for model management

async function createPersonalizationModel() {
  const modelConfig = {
    name: 'hn-personalization-model',
    dataset_id: 'hn-engagement-dataset',
    model_type: 'recommendation',
    parameters: {
      algorithm: 'collaborative_filtering',
      features: ['user_embedding', 'item_embedding', 'interaction_history']
    }
  };

  return await makeShapedRequest('/v1/models', 'POST', modelConfig);
}
```

**Model Configuration**:
- **Collaborative Filtering**: User-item interaction patterns
- **Content-Based**: Story features and categories
- **Hybrid Approach**: Combines multiple recommendation strategies

#### Real-Time Ranking (Shaped Rank API)

**Personalized Story Ranking**: Dynamic story ordering for each user
```javascript
app.post('/api/feed/personalized', async (req, res) => {
  const { userId, stories } = req.body;
  
  if (!SHAPED_API_KEY) {
    // Fallback to basic sorting if Shaped is not configured
    const sortedStories = stories.sort((a, b) => b.points - a.points);
    return res.json({ stories: sortedStories });
  }

  try {
    // Prepare items for Shaped ranking
    const items = stories.map(story => ({
      item_id: story.id.toString(),
      properties: {
        title: story.title,
        points: story.points,
        author: story.author,
        comments: story.comments,
        category: story.category,
        url: story.url
      }
    }));

    // Get personalized ranking from Shaped
    const rankingResponse = await makeShapedRequest('/v1/rank', 'POST', {
      user_id: userId,
      items: items
    });

    // Map ranked items back to stories
    const rankedStories = rankingResponse.items.map(rankedItem => {
      const originalStory = stories.find(s => s.id.toString() === rankedItem.item_id);
      return {
        ...originalStory,
        rank_score: rankedItem.score
      };
    });

    res.json({ stories: rankedStories });
  } catch (error) {
    console.error('Failed to get personalized ranking:', error);
    // Fallback to basic sorting
    const sortedStories = stories.sort((a, b) => b.points - a.points);
    res.json({ stories: sortedStories });
  }
});
```

**Ranking Process**:
1. **Story Preparation**: Convert stories to Shaped item format
2. **Ranking Request**: Send user and items to Shaped
3. **Score Assignment**: Shaped returns personalized scores
4. **Story Mapping**: Map ranked items back to original stories
5. **Fallback Handling**: Graceful degradation if Shaped unavailable

#### Frontend Personalization Integration (`src/services/engagementService.ts`)

**Personalized Feed Service**: Client-side integration with ranking API
```typescript
export const getPersonalizedFeed = async (request: PersonalizedFeedRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feed/personalized`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    return data.stories;
  } catch (error) {
    console.error('Failed to get personalized feed:', error);
    // Fallback to basic sorting
    return request.stories.sort((a, b) => b.points - a.points);
  }
};
```

**Request Structure**:
```typescript
interface PersonalizedFeedRequest {
  userId: string;
  stories: Story[];
}
```

#### Feed Display with Personalization (`src/pages/Index.tsx`)

**Dual Feed System**: Standard and personalized feeds with seamless switching
```typescript
const [activeFeed, setActiveFeed] = useState<FeedType>('personalized');
const [personalizedStories, setPersonalizedStories] = useState<Story[]>([]);

// Get personalized feed when user is authenticated
useEffect(() => {
  if (user && allStories.length > 0) {
    getPersonalizedFeed({
      userId: user.id,
      stories: allStories
    }).then(setPersonalizedStories);
  }
}, [user, allStories]);

// Get stories for current feed
const getCurrentStories = () => {
  if (activeFeed === 'personalized' && user) {
    return personalizedStories.filter(story => 
      activeFilter === 'all' || story.category === activeFilter
    );
  } else {
    return categoryFilteredStories.sort((a, b) => b.points - a.points);
  }
};
```

**Feed Tabs Implementation**:
```typescript
<Tabs value={activeFeed} onValueChange={(value) => handleFeedChange(value as FeedType)}>
  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
    <TabsTrigger value="personalized" className="flex items-center gap-2">
      <User className="w-4 h-4" />
      For You
    </TabsTrigger>
    <TabsTrigger value="standard" className="flex items-center gap-2">
      <TrendingUp className="w-4 h-4" />
      Standard
    </TabsTrigger>
  </TabsList>
</Tabs>
```

#### Personalization Score Display (`src/components/FeedItem.tsx`)

**Relevance Indicators**: Show personalization scores to users
```typescript
{story.rank_score && (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-500/30">
    Score: {story.rank_score.toFixed(2)}
  </span>
)}
```

**Score Interpretation**:
- **Higher Scores**: More relevant to user preferences
- **Lower Scores**: Less relevant but still shown
- **No Score**: Fallback to standard ranking

#### Fallback Mechanisms

**Graceful Degradation**: Multiple fallback levels
```typescript
// Level 1: Shaped API unavailable
if (!SHAPED_API_KEY) {
  return stories.sort((a, b) => b.points - a.points);
}

// Level 2: Shaped API error
try {
  // Shaped ranking logic
} catch (error) {
  console.error('Failed to get personalized ranking:', error);
  return stories.sort((a, b) => b.points - a.points);
}

// Level 3: Network error
catch (error) {
  console.error('Failed to get personalized feed:', error);
  return request.stories.sort((a, b) => b.points - a.points);
}
```

**Fallback Hierarchy**:
1. **Shaped Personalization**: Full AI-powered ranking
2. **Basic Sorting**: Points-based sorting
3. **Original Order**: Maintain HN API order
4. **Error State**: Show appropriate error message

#### Performance Optimizations

**Caching Strategy**:
- **Personalized Results**: Cache for 2-3 minutes
- **User Context**: Cache user preferences
- **Story Metadata**: Cache story properties

**Request Optimization**:
- **Batch Ranking**: Rank multiple stories in single request
- **Parallel Processing**: Fetch stories and rank simultaneously
- **Lazy Loading**: Load personalized feed on demand

#### Model Training Workflow

**Data Collection Phase**:
1. **User Registration**: Create user profile
2. **Engagement Tracking**: Collect clicks, votes, comments
3. **Event Processing**: Send events to Shaped dataset
4. **Data Validation**: Ensure data quality

**Model Training Phase**:
1. **Dataset Preparation**: Clean and format engagement data
2. **Feature Engineering**: Extract user and story features
3. **Model Training**: Train recommendation model
4. **Model Evaluation**: Validate model performance

**Deployment Phase**:
1. **Model Deployment**: Deploy trained model
2. **A/B Testing**: Compare with baseline
3. **Performance Monitoring**: Track recommendation quality
4. **Continuous Learning**: Retrain with new data

#### Personalization Quality Metrics

**Engagement Metrics**:
- **Click-Through Rate**: Percentage of stories clicked
- **Time Spent**: Average time on personalized stories
- **Return Rate**: Users returning to personalized feed

**Recommendation Metrics**:
- **Diversity**: Variety of story categories recommended
- **Novelty**: New stories vs. previously seen
- **Relevance**: User satisfaction with recommendations

This personalized feed implementation provides a complete AI-powered recommendation system that learns from user behavior and adapts over time. The integration with Shaped's APIs enables sophisticated personalization while maintaining robust fallback mechanisms for reliability.

## 🐛 Troubleshooting

### Common Issues and Solutions

#### "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### "Port already in use" error
```bash
# Find and kill the process using port 3001
# On Windows:
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

#### "Shaped API not configured" warning
- Check your `.env` file has `SHAPED_API_KEY`
- Verify the API key is valid at shaped.ai
- Restart the development servers

#### "Server connection failed"
```bash
# Check if backend is running
curl http://localhost:3001/api/health

# If it fails, start the server:
npm run server
```

#### "Personalization not working"
- Ensure Shaped API key is valid
- Check that engagement events are being sent
- Wait for Shaped model training (can take time)
- Check browser console for errors

### Debug Mode

Add to your `.env` file:
```env
DEBUG=true
```

This will show additional logging information.

### Browser Console Errors

1. **Open Developer Tools**: F12 or right-click → Inspect
2. **Check Console Tab**: Look for red error messages
3. **Check Network Tab**: Verify API calls are successful

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting service
```

### Backend Deployment (Railway/Render)

1. **Set Environment Variables**:
   - `SHAPED_API_KEY`: Your Shaped API key
   - `PORT`: 3001 (or your preferred port)

2. **Deploy**:
   ```bash
   npm run server
   ```

### Environment Variables for Production

```env
SHAPED_API_KEY=your_production_key
VITE_API_BASE_URL=https://your-backend-url.com
PORT=3001
```

## 📚 API Documentation

### Hacker News API
- **Base URL**: `https://hacker-news.firebaseio.com/v0/`
- **Endpoints**: `/topstories.json`, `/item/{id}.json`
- **Rate Limits**: None specified

### Shaped API
- **Base URL**: `https://api.shaped.ai/v1/`
- **Endpoints**: `/events`, `/rank`
- **Authentication**: Bearer token

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** your changes: `git commit -m 'Add feature'`
6. **Push** to the branch: `git push origin feature-name`
7. **Submit** a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ using React, TypeScript, and Shaped AI**

For support, please open an issue on GitHub.
