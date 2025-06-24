"use client"

import ProtectedRoute from '../../auth/ProtectedRoute';
import { useAppStore } from '../../store/useAppStore';

export default function DashboardPage() {
  const { login, signup, logout, user } = useAppStore();
  const username = "John Doe";
  const totalFeedbacks = 24;
  const unreadFeedbacks = 5;
  const recentFeedbacks = [
    { id: 1, from: "Manager", date: "2 hours ago", preview: "Great work on the project presentation..." },
    { id: 2, from: "Team Lead", date: "1 day ago", preview: "Let's improve the response time..." },
    { id: 3, from: "Colleague", date: "3 days ago", preview: "Your documentation was very helpful..." },
  ];

  console.log("USER:",user)
  return (
    <ProtectedRoute>
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <p className="text-lg mt-1">Welcome back, {user.full_name}!</p>
      </div>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Feedbacks */}
        <div className="bg-transparent border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Total Feedbacks</h2>
          <p className="text-3xl font-bold mt-2 text-indigo-600">{totalFeedbacks}</p>
        </div>

        {/* Unread Feedbacks */}
        <div className=" bg-transparent border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-700">Unread Feedbacks</h2>
          <p className="text-3xl font-bold mt-2 text-red-500">{unreadFeedbacks}</p>
        </div>
      </div>

      {/* Recent Feedbacks */}
      <div className="bg-transparent border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Feedbacks</h2>
        <div className="space-y-4">
          {recentFeedbacks.map((feedback) => (
            <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{feedback.from}</h3>
                  <p className="text-gray-600 text-sm">{feedback.date}</p>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">
                  View
                </button>
              </div>
              <p className="mt-2 text-gray-700">{feedback.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}