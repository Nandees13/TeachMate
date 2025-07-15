import React, { useState } from 'react';
import { Feature, User } from '../types';
import Sidebar from './Sidebar';
import QAGenerator from './QAGenerator';
import NoteGenerator from './NoteGenerator';
import ConceptExplainer from './ConceptExplainer';
import ProfileModal from './ProfileModal';
import Whiteboard from './Whiteboard';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: Partial<User>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onUpdateProfile }) => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.QA_GENERATOR);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleProfileUpdate = (updatedData: Partial<User>) => {
    onUpdateProfile(updatedData);
    setProfileModalOpen(false); // Close modal after updating
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case Feature.QA_GENERATOR:
        return <QAGenerator />;
      case Feature.NOTE_GENERATOR:
        return <NoteGenerator />;
      case Feature.CONCEPT_EXPLAINER:
        return <ConceptExplainer />;
      case Feature.WHITEBOARD:
        return <Whiteboard />;
      default:
        return <QAGenerator />;
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          user={user}
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
          onLogout={onLogout}
          onProfileClick={() => setProfileModalOpen(true)}
        />
        <main className="flex-1 ml-64">
          {renderActiveFeature()}
        </main>
      </div>
      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default Dashboard;
