
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const storyTopics = [
  { id: 'technology', label: 'Technology & Programming', keywords: ['tech', 'programming', 'software', 'ai', 'machine learning', 'blockchain', 'crypto'] },
  { id: 'startups', label: 'Startups & Business', keywords: ['startup', 'business', 'entrepreneur', 'funding', 'vc', 'saas'] },
  { id: 'science', label: 'Science & Research', keywords: ['science', 'research', 'biology', 'physics', 'chemistry', 'medical'] },
  { id: 'design', label: 'Design & UX', keywords: ['design', 'ux', 'ui', 'interface', 'visual', 'graphics'] },
  { id: 'security', label: 'Security & Privacy', keywords: ['security', 'privacy', 'hacking', 'cybersecurity', 'encryption'] },
  { id: 'data', label: 'Data & Analytics', keywords: ['data', 'analytics', 'database', 'big data', 'visualization'] },
  { id: 'mobile', label: 'Mobile & Apps', keywords: ['mobile', 'app', 'ios', 'android', 'flutter', 'react native'] },
  { id: 'web', label: 'Web Development', keywords: ['web', 'javascript', 'react', 'frontend', 'backend', 'api'] }
];

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleTopicChange = (topicId: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics(prev => [...prev, topicId]);
    } else {
      setSelectedTopics(prev => prev.filter(id => id !== topicId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (selectedTopics.length === 0) {
      setError('Please select at least one topic of interest');
      setIsLoading(false);
      return;
    }

    const success = await signup(name, email, password, selectedTopics);
    if (success) {
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setSelectedTopics([]);
    } else {
      setError('Failed to create account. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Your Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Password"
              required
            />
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium">What topics interest you most?</label>
            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
              {storyTopics.map((topic) => (
                <div key={topic.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={topic.id}
                    checked={selectedTopics.includes(topic.id)}
                    onCheckedChange={(checked) => handleTopicChange(topic.id, !!checked)}
                    className="border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label
                    htmlFor={topic.id}
                    className="text-sm text-gray-300 cursor-pointer"
                  >
                    {topic.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
