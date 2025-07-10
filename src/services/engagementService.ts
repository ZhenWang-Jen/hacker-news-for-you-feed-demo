const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface EngagementEvent {
  userId: string;
  storyId: number;
  eventType: 'click' | 'upvote' | 'comment';
  metadata?: Record<string, any>;
}

export interface PersonalizedFeedRequest {
  userId: string;
  stories: any[];
}

export const trackEngagement = async (event: EngagementEvent): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/engagement/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to track engagement:', error);
    return false;
  }
};

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

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}; 