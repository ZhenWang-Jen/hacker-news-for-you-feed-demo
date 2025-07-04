
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  preferences: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, preferences: string[]) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email === 'demo@example.com' && password === 'password') {
      setUser({
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        preferences: ['technology', 'startups', 'web'] // Default preferences for demo user
      });
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string, preferences: string[]): Promise<boolean> => {
    // Simulate API call
    try {
      setUser({
        id: Date.now().toString(),
        email,
        name,
        preferences
      });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
