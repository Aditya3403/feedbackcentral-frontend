"use client";
import ProtectedRoute from '../../../../auth/ProtectedRoute';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, Trash2, Eye, X } from 'lucide-react';
import { useAppStore } from '../../../../store/useAppStore';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Feedback = {
  id: string;
  sno: number;
  date: string;
  feedback: string;
  status: 'pending' | 'acknowledged';
  employee?: string;
  strengths?: string;
  areasToImprove?: string;
  overallSentiment?: 'positive' | 'negative' | 'neutral';
};

type FeedbackResponse = {
  id: string | number;
  created_at: string;
  feedback_status?: string;
  employee_name?: string;
  strengths?: string;
  areas_to_improve?: string;
  overall_sentiment?: string;
};

const FeedbackReceived = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user, token, userType } = useAppStore();
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    feedbackId: '',
    employeeName: '',
    originalFeedback: '',
    originalDate: '',
    strengths: '',
    areasToImprove: '',
    sentiment: 'positive' as 'positive' | 'neutral' | 'negative'
  });
  const feedbackModalRef = useRef<HTMLDivElement>(null);

  const companyName = user?.company || "Acme Corporation";
  const manager = user?.managers?.[0]?.manager_name || "No Manager Assigned";
  const isEmployee = userType === 'employee';
  
  const fetchFeedbackData = useCallback(async () => {
    if (!isEmployee) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/auth/received-feedback/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setFeedbackData(response.data.map((fb: FeedbackResponse, index: number) => ({
          id: fb.id.toString(),
          sno: index + 1,
          date: fb.created_at?.split('T')[0] || '',
          feedback: `${fb.strengths || ''}\n\n${fb.areas_to_improve || ''}`,
          status: fb.feedback_status?.toLowerCase() === 'acknowledged' ? 'acknowledged' : 'pending',
          employee: fb.employee_name || '',
          strengths: fb.strengths,
          areasToImprove: fb.areas_to_improve,
          overallSentiment: fb.overall_sentiment?.toLowerCase() as 'positive' | 'negative' | 'neutral'
        })));
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedbackData([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token, isEmployee, BACKEND_URL]);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const openFeedbackModal = useCallback((feedback: Feedback) => {
    setFeedbackModal({
      isOpen: true,
      feedbackId: feedback.id,
      employeeName: feedback.employee || 'Employee',
      originalFeedback: feedback.feedback,
      originalDate: feedback.date,
      strengths: feedback.strengths || '',
      areasToImprove: feedback.areasToImprove || '',
      sentiment: feedback.overallSentiment || 'positive'
    });
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setFeedbackModal({
      isOpen: false,
      feedbackId: '',
      employeeName: '',
      originalFeedback: '',
      originalDate: '',
      strengths: '',
      areasToImprove: '',
      sentiment: 'positive'
    });
  }, []);

  const handleAcknowledge = useCallback(async (feedbackId: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/auth/acknowledge-feedback`, {
        feedback_id: feedbackId,
        employee_id: user?.id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('Feedback acknowledged successfully!');
        await fetchFeedbackData();
      }
    } catch (error) {
      console.error('Error acknowledging feedback:', error);
      toast.error('Failed to acknowledge feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchFeedbackData, token, BACKEND_URL]);
  
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (feedbackModal.isOpen) closeFeedbackModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (feedbackModalRef.current && !feedbackModalRef.current.contains(event.target as Node)) {
        closeFeedbackModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [feedbackModal.isOpen, closeFeedbackModal]);

  const columns: ColumnDef<Feedback>[] = [
    {
      accessorKey: 'sno',
      header: 'S.No.',
      cell: ({ row }) => <span className="text-gray-700">{row.index + 1}</span>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-gray-700">
          {new Date(row.original.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
    {
      accessorKey: 'feedback',
      header: 'View Feedback',
      cell: ({ row }) => (
        <div className="max-w-md">
          <button
            type="button"
            onClick={() => openFeedbackModal(row.original)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status === 'pending' && (
            <button
              type="button"
              onClick={() => handleAcknowledge(row.original.id)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
              title="Acknowledge"
            >
              <Check size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: feedbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ProtectedRoute>
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Feedback Received</h2>
        
        {isEmployee ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                      {companyName}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manager
                    </label>
                    <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                      {manager}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <th
                              key={header.id}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.original.status === 'acknowledged' ? 'bg-gray-50' : ''}`}>
                          {row.getVisibleCells().map(cell => (
                            <td
                              key={cell.id}
                              className="px-6 py-4 whitespace-nowrap text-sm item-center"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {feedbackData.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    No feedback received yet.
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <p className="text-gray-700 text-lg">You don&apos;t have any feedbacks to view</p>
            </div>
          </div>
        )}

        {feedbackModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm">
            <div 
              ref={feedbackModalRef}
              className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl transform transition-all max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Your Feedback
                </h3>
                <button
                  type="button"
                  onClick={closeFeedbackModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strengths
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm bg-gray-50 min-h-[100px] text-gray-700">
                    {feedbackModal.strengths || 'No strengths provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas to Improve
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm bg-gray-50 min-h-[100px] text-gray-700">
                    {feedbackModal.areasToImprove || 'No areas to improve provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Sentiment
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 capitalize">
                    {feedbackModal.sentiment || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default FeedbackReceived;