"use client"
import ProtectedRoute from '../../auth/ProtectedRoute';
import { useAppStore } from '../../store/useAppStore';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Check, Trash2, Eye, X } from 'lucide-react';

export default function DashboardPage() {
  const { user, token, userType } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [unreadFeedbacks, setUnreadFeedbacks] = useState(0);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    feedback: null as any,
  });

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      let endpoint = '';
      
      if (userType === 'manager') {
        endpoint = `http://127.0.0.1:8000/api/auth/manager-feedbacks/${user?.id}`;
      } else {
        endpoint = `http://127.0.0.1:8000/api/auth/received-feedback/${user?.id}`;
      }

      const response = await axios.get(endpoint);
      
      if (response.data) {
        const feedbacks = response.data.map((fb: any) => ({
          id: fb.id.toString(),
          date: new Date(fb.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          strengths: fb.strengths,
          areasToImprove: fb.areas_to_improve,
          sentiment: fb.overall_sentiment?.toLowerCase(),
          managerName: fb.manager_name || 'Manager'
        }));

        setTotalFeedbacks(feedbacks.length);
        setUnreadFeedbacks(feedbacks.filter((f: any) => f.status === 'pending').length);
        setRecentFeedbacks(feedbacks.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userType]);

  useEffect(() => {
    if (user?.id) {
      fetchFeedbacks();
    }
  }, [user?.id, fetchFeedbacks]);

  const openFeedbackModal = (feedback: any) => {
    setFeedbackModal({
      isOpen: true,
      feedback
    });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({
      isOpen: false,
      feedback: null
    });
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.full_name}!</h1>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Feedbacks */}
          <div className="bg-transparent border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Feedbacks</h2>
            <p className="text-3xl font-bold mt-2 text-indigo-600">
              {isLoading ? '--' : totalFeedbacks}
            </p>
          </div>

          {/* Unread Feedbacks */}
          <div className="bg-transparent border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700">Unread Feedbacks</h2>
            <p className="text-3xl font-bold mt-2 text-red-500">
              {isLoading ? '--' : unreadFeedbacks}
            </p>
          </div>
        </div>

        {/* Recent Feedbacks */}
        <h2 className="text-xl font-semibold mb-4">Recent Feedbacks</h2>
        <div className="bg-transparent border border-gray-200 rounded-lg p-6">
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : recentFeedbacks.length > 0 ? (
            <div className="space-y-4">
              {recentFeedbacks.map((feedback: any) => (
                <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {userType === 'manager' ? 'You' : `${feedback.managerName} [Manager]`}
                      </h3>
                      <p className="text-gray-600 text-sm">{feedback.date}</p>
                    </div>
                    <button 
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                      onClick={() => openFeedbackModal(feedback)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-700">Preview:</h4>
                    <p className="text-gray-700 line-clamp-2">
                      {feedback.strengths.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-4">No recent feedbacks found</p>
          )}
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {feedbackModal.isOpen && feedbackModal.feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Feedback Details</h2>
              <button 
                onClick={closeFeedbackModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium">
                  {userType === 'manager' ? 'You' : `[Manager] ${feedbackModal.feedback.managerName}`}
                </h3>
                <p className="text-gray-600 text-sm">{feedbackModal.feedback.date}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Strengths</h3>
                <p className="text-gray-700 mt-1 whitespace-pre-line">
                  {feedbackModal.feedback.strengths}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Areas of Improvement</h3>
                <p className="text-gray-700 mt-1 whitespace-pre-line">
                  {feedbackModal.feedback.areasToImprove}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Overall Sentiment</h3>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                  feedbackModal.feedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                  feedbackModal.feedback.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {feedbackModal.feedback.sentiment.charAt(0).toUpperCase() + feedbackModal.feedback.sentiment.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}