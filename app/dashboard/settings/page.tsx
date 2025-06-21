"use client"

import { useState } from 'react';
import { User, Mail, Briefcase, ChevronDown, Hotel, Lock, Key } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('user-info');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  // User data - replace with actual user data from context/API
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Corporation',
    role: 'manager', // or 'employee'
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('user-info')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'user-info'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button>
        </nav>
      </div>

      {/* User Information Tab */}
      {activeTab === 'user-info' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Name</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Email</label>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                />
              ) : (
                <p className="text-gray-900">{user.email}</p>
              )}
            </div>

            {/* Company Field */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Hotel className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Company</label>
              </div>
              <p className="text-gray-900">{user.company}</p>
            </div>

            {/* Role Field */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Role</label>
              </div>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-6">
            <h2 className="text-lg font-medium">Change Password</h2>
            
            {/* Password Fields in Single Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Password */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Key className="w-5 h-5 text-gray-500" />
                  <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-gray-500" />
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            {/* Update Password Button */}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => console.log('Update password:', passwordData)}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;