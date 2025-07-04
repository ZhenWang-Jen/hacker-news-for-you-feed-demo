
export const storyTopicsConfig = {
  technology: ['tech', 'programming', 'software', 'ai', 'machine learning', 'blockchain', 'crypto', 'algorithm', 'code', 'developer'],
  startups: ['startup', 'business', 'entrepreneur', 'funding', 'vc', 'saas', 'company', 'launch', 'growth'],
  science: ['science', 'research', 'biology', 'physics', 'chemistry', 'medical', 'study', 'discovery', 'experiment'],
  design: ['design', 'ux', 'ui', 'interface', 'visual', 'graphics', 'user experience', 'prototype'],
  security: ['security', 'privacy', 'hacking', 'cybersecurity', 'encryption', 'breach', 'vulnerability'],
  data: ['data', 'analytics', 'database', 'big data', 'visualization', 'analysis', 'statistics'],
  mobile: ['mobile', 'app', 'ios', 'android', 'flutter', 'react native', 'smartphone'],
  web: ['web', 'javascript', 'react', 'frontend', 'backend', 'api', 'html', 'css', 'node']
};

export const matchStoryToPreferences = (storyTitle: string, userPreferences: string[]): boolean => {
  if (userPreferences.length === 0) return true;
  
  const lowerTitle = storyTitle.toLowerCase();
  
  return userPreferences.some(preference => {
    const keywords = storyTopicsConfig[preference as keyof typeof storyTopicsConfig] || [];
    return keywords.some(keyword => lowerTitle.includes(keyword.toLowerCase()));
  });
};

export const getRelevanceScore = (storyTitle: string, userPreferences: string[]): number => {
  if (userPreferences.length === 0) return 0;
  
  const lowerTitle = storyTitle.toLowerCase();
  let score = 0;
  
  userPreferences.forEach(preference => {
    const keywords = storyTopicsConfig[preference as keyof typeof storyTopicsConfig] || [];
    keywords.forEach(keyword => {
      if (lowerTitle.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
  });
  
  return score;
};
