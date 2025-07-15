import React from 'react';
import { APP_TITLE, FEATURES } from '../constants';
import { Feature, User } from '../types';
import { BrainCircuitIcon, QAPlusIcon, NoteIcon, LightbulbIcon, SettingsIcon, LogOutIcon, WhiteboardIcon } from './Icons';

interface SidebarProps {
  user: User;
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

const featureIcons: { [key in Feature]: React.ReactNode } = {
  [Feature.QA_GENERATOR]: <QAPlusIcon className="w-5 h-5 mr-3" />,
  [Feature.NOTE_GENERATOR]: <NoteIcon className="w-5 h-5 mr-3" />,
  [Feature.CONCEPT_EXPLAINER]: <LightbulbIcon className="w-5 h-5 mr-3" />,
  [Feature.WHITEBOARD]: <WhiteboardIcon className="w-5 h-5 mr-3" />,
};

const Sidebar: React.FC<SidebarProps> = ({ user, activeFeature, setActiveFeature, onLogout, onProfileClick }) => {
  const getAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff&font-size=0.5`;

  return (
    <aside className="w-64 bg-white p-4 flex flex-col h-screen fixed shadow-lg">
      <div className="flex items-center mb-8">
        <BrainCircuitIcon className="w-8 h-8 text-primary-700 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">{APP_TITLE}</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activeFeature === feature.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-current={activeFeature === feature.id ? 'page' : undefined}
          >
            {featureIcons[feature.id]}
            {feature.name}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="border-t pt-4 space-y-2">
           <div className="flex items-center p-2">
              <img src={user.photoURL || getAvatarUrl(user.name)} className="w-10 h-10 rounded-full mr-3" alt="User Avatar" />
              <div>
                  <p className="font-semibold text-gray-800 text-sm truncate" title={user.name}>{user.name}</p>
                  <p className="text-xs text-gray-500 truncate" title={user.department}>{user.department || 'No Department'}</p>
              </div>
          </div>
          <button onClick={onProfileClick} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            <SettingsIcon className="w-5 h-5 mr-3" />
            Profile Settings
          </button>
          <button onClick={onLogout} className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
            <LogOutIcon className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
        <div className="mt-4 pt-4 border-t text-xs text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TeachMate</p>
          <p>Powered by Google Gemini</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
