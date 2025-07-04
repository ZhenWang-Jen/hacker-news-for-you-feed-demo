
const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

export const fetchTopStories = async (limit: number = 30): Promise<number[]> => {
  const response = await fetch(`${HN_API_BASE}/topstories.json`);
  const storyIds = await response.json();
  return storyIds.slice(0, limit);
};

export const fetchStory = async (id: number): Promise<HNStory> => {
  const response = await fetch(`${HN_API_BASE}/item/${id}.json`);
  return response.json();
};

export const fetchStories = async (ids: number[]): Promise<HNStory[]> => {
  const promises = ids.map(id => fetchStory(id));
  const stories = await Promise.all(promises);
  return stories.filter(story => story && story.title); // Filter out null/deleted stories
};

export const getTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export const getStoryCategory = (title: string): 'story' | 'show' | 'ask' | 'job' => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.startsWith('show hn:')) return 'show';
  if (lowerTitle.startsWith('ask hn:')) return 'ask';
  if (lowerTitle.includes('hiring') || lowerTitle.includes('job')) return 'job';
  return 'story';
};

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
