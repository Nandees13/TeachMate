
import React, { useState } from 'react';
import type { User } from '../types';
import Card from './common/Card';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (data: Partial<User>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [department, setDepartment] = useState(user.department || '');
  const [subject, setSubject] = useState(user.subject || '');

  const getAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1d4ed8&color=fff&font-size=0.5&length=2`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ department, subject });
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
    >
      <Card 
        className="w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
            <img 
                src={user.photoURL || getAvatarUrl(user.name)} 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full mb-4 border-4 border-primary-100"
            />
            <h2 id="profile-modal-title" className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 mb-6">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Database Management Systems"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
             <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileModal;
