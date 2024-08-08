// components/Sidebar.js
'use client'
import { useState, memo } from 'react';
import { FaUserEdit, FaUsers, FaUserFriends, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Sidebar = ({ onSelectTab }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  return (
    <div className="w-1/4 h-full bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl mb-4">Dashboard</h2>
        <ul>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'profile' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('profile')}
          >
            <FaUserEdit className="inline-block mr-2" />
            Update Profile
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'connects' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('connects')}
          >
            <FaUserFriends className="inline-block mr-2" />
            Connects/Other Users
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'group' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('group')}
          >
            <FaUsers fill='white' className="inline-block mr-2" />
            Create Group Chats
          </li>
        </ul>
      </div>
      <button
        className="mt-4 p-2 w-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
        onClick={handleSignOut}
      >
        <FaSignOutAlt fill='white' className="inline-block mr-2" />
        Sign Out
      </button>
    </div>
  );
};

export default memo(Sidebar);