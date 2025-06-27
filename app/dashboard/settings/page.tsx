"use client"
import ProtectedRoute from '../../../auth/ProtectedRoute';
import { useState } from 'react';
import { User, Mail, Briefcase, ChevronDown, Hotel, Lock, Key } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

const SettingsPage = () => {
  const { login, signup, logout, user } = useAppStore();
  const [activeTab, setActiveTab] = useState('user-info');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ProtectedRoute>
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
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
          {/* <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Security
          </button> */}
        </nav>
      </div>

      {/* User Information Tab */}
      {activeTab === 'user-info' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Name</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  defaultValue={user.full_name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                />
              ) : (
                <p className="text-gray-900">{user.full_name}</p>
              )}
            </div>
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

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Hotel className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Company</label>
              </div>
              <p className="text-gray-900">{user.company}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">Department</label>
              </div>
              <p className="text-gray-900 capitalize">{user.department}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default SettingsPage;