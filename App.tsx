
import React, { useState } from 'react';
import type { User } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

// Mock user data for simulation purposes
const MOCK_USER: User = {
  name: 'Faculty Member',
  email: 'faculty.member@university.edu',
  photoURL: `https://i.pravatar.cc/150?u=faculty${Date.now()}` // Add timestamp to avoid caching
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // In a real application, this would involve Firebase Authentication
    setUser(MOCK_USER);
  };

  const handleLogout = () => {
    // In a real application, this would involve signing out from Firebase
    setUser(null);
  };

  const handleUpdateProfile = (updatedData: Partial<User>) => {
    if (user) {
      setUser(prevUser => ({ ...prevUser!, ...updatedData }));
    }
  };

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} />;
};

export default App;
