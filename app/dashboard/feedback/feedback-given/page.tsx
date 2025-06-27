"use client";
import { Plus, Pencil, Eye } from 'lucide-react';
import { useAppStore } from '../../../../store/useAppStore';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  feedback: string;
  feedback_count: number;
  feedback_statuses: string[];
};

type Feedback = {
  id: string;
  date: string;
  strengths: string;
  areasToImprove: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'pending' | 'acknowledged';
};

type EditingFeedback = {
  id: string | null;
  strengths: string;
  areasToImprove: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

type EmployeeResponse = {
  id: number | string;
  full_name: string;
  email: string;
  feedback_count?: number;
  feedback_statuses?: string[];
};

type FeedbackResponse = {
  id: number | string;
  created_at: string;
  strengths: string;
  areas_to_improve: string;
  overall_sentiment: string;
  status: string;
};

const FeedbackGiven = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const { user, userType } = useAppStore();
  const isManager = userType === 'manager';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    employeeId: '',
    employeeName: '',
    strengths: '',
    areasToImprove: '',
    sentiment: 'positive' as 'positive' | 'neutral' | 'negative'
  });
  const [viewFeedbackModal, setViewFeedbackModal] = useState({
    isOpen: false,
    employeeName: '',
    feedbacks: [] as Feedback[]
  });
  const [editingFeedback, setEditingFeedback] = useState<EditingFeedback>({
    id: null,
    strengths: '',
    areasToImprove: '',
    sentiment: 'positive'
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const feedbackModalRef = useRef<HTMLDivElement>(null);
  const viewFeedbackModalRef = useRef<HTMLDivElement>(null);

  const companyName = user?.company || 'Unknown Company';
  const department = user?.department || "No department assigned";

  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/auth/get-employees?manager_id=${user?.id}`);
      if (response.data.success) {
        setTeamMembers(response.data.employees.map((emp: EmployeeResponse) => ({
          id: emp.id.toString(),
          name: emp.full_name,
          email: emp.email,
          feedback: `${emp.feedback_count || 0} Given`,
          feedback_count: emp.feedback_count || 0,
          feedback_statuses: emp.feedback_statuses || []
        })));
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, BACKEND_URL]);

  useEffect(() => {
    if (user?.id) {
      fetchEmployees();
    }
  }, [user?.id, fetchEmployees]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const openFeedbackModal = useCallback((employeeId: string, employeeName: string) => {
    setFeedbackModal({
      isOpen: true,
      employeeId,
      employeeName,
      strengths: '',
      areasToImprove: '',
      sentiment: 'positive'
    });
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setFeedbackModal({
      isOpen: false,
      employeeId: '',
      employeeName: '',
      strengths: '',
      areasToImprove: '',
      sentiment: 'positive'
    });
  }, []);

  const openViewFeedbackModal = useCallback(async (employeeId: string, employeeName: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/auth/manager-feedbacks/${user?.id}?employee_id=${employeeId}`);
      if (response.data) {
        const feedbacks = response.data.map((fb: FeedbackResponse) => ({
          id: fb.id.toString(),
          date: fb.created_at.split('T')[0],
          strengths: fb.strengths,
          areasToImprove: fb.areas_to_improve,
          sentiment: fb.overall_sentiment.toLowerCase() as 'positive' | 'neutral' | 'negative',
          status: fb.status.toLowerCase() as 'pending' | 'acknowledged'
        }));
        
        setViewFeedbackModal({
          isOpen: true,
          employeeName,
          feedbacks
        });
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, BACKEND_URL]);

  const closeViewFeedbackModal = useCallback(() => {
    setViewFeedbackModal({
      isOpen: false,
      employeeName: '',
      feedbacks: []
    });
    cancelEditing();
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (name && email) {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/add-employee`, {
          employee_name: name,
          employee_email: email,
          manager_id: user?.id
        });

        if (response.data.success) {
          toast.success('Email sent to the employee successfully!');
          await fetchEmployees();
          closeModal();
          (e.target as HTMLFormElement).reset();
        }
      } catch (error) {
        console.error('Error adding employee:', error);
        toast.error('Failed to send email to employee. Please try again.');
      }
    }
  }, [closeModal, user?.id, fetchEmployees, BACKEND_URL]);

  const handleFeedbackSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const strengths = formData.get('strengths') as string;
    const areasToImprove = formData.get('areasToImprove') as string;
    const sentiment = formData.get('sentiment') as string;

    const uppercaseSentiment = sentiment.toUpperCase();
    
    const validSentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
    if (!validSentiments.includes(uppercaseSentiment)) {
      toast.error('Invalid sentiment value');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${BACKEND_URL}/api/auth/submit-feedback`, {
        manager_id: user?.id,
        employee_id: feedbackModal.employeeId,
        strengths,
        areas_to_improve: areasToImprove,
        overall_sentiment: uppercaseSentiment,
        date: new Date().toISOString().split('T')[0]
      });

      if (response.data.success) {
        toast.success('Feedback submitted successfully!');
        closeFeedbackModal();
        await fetchEmployees();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [feedbackModal.employeeId, user?.id, fetchEmployees, closeFeedbackModal, BACKEND_URL]);

  const startEditing = useCallback((feedback: Feedback) => {
    setEditingFeedback({
      id: feedback.id,
      strengths: feedback.strengths,
      areasToImprove: feedback.areasToImprove,
      sentiment: feedback.sentiment
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingFeedback({
      id: null,
      strengths: '',
      areasToImprove: '',
      sentiment: 'positive'
    });
  }, []);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleFeedbackUpdate = useCallback(async (feedbackId: string) => {
    try {
      setIsLoading(true);
      
      const validSentiments = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
      const uppercaseSentiment = editingFeedback.sentiment.toUpperCase();
      if (!validSentiments.includes(uppercaseSentiment)) {
        toast.error('Invalid sentiment value');
        return;
      }

      const response = await axios.put(`${BACKEND_URL}/api/auth/update-feedback/${feedbackId}`, {
        strengths: editingFeedback.strengths,
        areas_to_improve: editingFeedback.areasToImprove,
        overall_sentiment: uppercaseSentiment
      });

      if (response.data.success) {
        toast.success('Feedback updated successfully!');
        
        setViewFeedbackModal(prev => ({
          ...prev,
          feedbacks: prev.feedbacks.map(fb => 
            fb.id === feedbackId ? {
              ...fb,
              strengths: editingFeedback.strengths,
              areasToImprove: editingFeedback.areasToImprove,
              sentiment: editingFeedback.sentiment
            } : fb
          )
        }));
        
        cancelEditing();
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [editingFeedback, cancelEditing, BACKEND_URL]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isModalOpen) closeModal();
        if (feedbackModal.isOpen) closeFeedbackModal();
        if (viewFeedbackModal.isOpen) closeViewFeedbackModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
      if (feedbackModalRef.current && !feedbackModalRef.current.contains(event.target as Node)) {
        closeFeedbackModal();
      }
      if (viewFeedbackModalRef.current && !viewFeedbackModalRef.current.contains(event.target as Node)) {
        closeViewFeedbackModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, feedbackModal.isOpen, viewFeedbackModal.isOpen, closeModal, closeFeedbackModal, closeViewFeedbackModal]);

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ getValue }) => <span className="font-medium">{getValue() as string}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'feedback',
      header: 'Feedback Count',
    },
    {
      id: 'acknowledged',
      header: 'Acknowledged',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.feedback_statuses.map((status, index) => (
            <span 
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                status === 'ACKNOWLEDGED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status === 'ACKNOWLEDGED' ? 'Yes' : 'No'}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-50 transition-colors"
            onClick={() => openViewFeedbackModal(row.original.id, row.original.name)}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className="text-green-600 hover:text-green-800 p-1 rounded-md hover:bg-green-50 transition-colors"
            onClick={() => openFeedbackModal(row.original.id, row.original.name)}
          >
            <Pencil size={16} />
          </button>
        </div>
      ),
    }
  ];

  const table = useReactTable({
    data: teamMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {isManager ? (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 relative">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Feedback Given</h2>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={openModal}
            >
              <Plus size={16} />
              Add Person
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {companyName}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                  {department}
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
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {teamMembers.length === 0 && !isLoading && (
                <div className="text-center py-8 text-gray-500">
                  No team members found. Add members to get started.
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <p className="text-gray-700 text-lg">You don&apos;t have permission to write feedback</p>
            <p className="text-gray-500 mt-2">Only managers can access this feature</p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Team Member</h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Full Name"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="member@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm">
          <div 
            ref={feedbackModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Write Feedback for {feedbackModal.employeeName}
              </h3>
              <button
                type="button"
                onClick={closeFeedbackModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strengths
                  </label>
                  <textarea
                    name="strengths"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[100px]"
                    placeholder="What are the employee's strengths?"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Areas to Improve
                  </label>
                  <textarea
                    name="areasToImprove"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[100px]"
                    placeholder="What areas could the employee improve?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Sentiment
                  </label>
                  <select
                    name="sentiment"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    defaultValue="positive"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  onClick={closeFeedbackModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewFeedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-sm overflow-y-auto">
          <div 
            ref={viewFeedbackModalRef}
            className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl transform transition-all my-8 max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 bg-white pb-4 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                Feedback for {viewFeedbackModal.employeeName}
              </h3>
              <button
                type="button"
                onClick={closeViewFeedbackModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {viewFeedbackModal.feedbacks.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">
                        {new Date(feedback.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        feedback.status === 'acknowledged' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.status === 'acknowledged' ? 'Acknowledged' : 'Pending'}
                      </span>
                    </div>
                    {editingFeedback.id === feedback.id ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedbackUpdate(feedback.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditing(feedback)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium px-2 py-1 rounded hover:bg-indigo-50"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Strengths</h4>
                      {editingFeedback.id === feedback.id ? (
                        <textarea
                          name="strengths"
                          value={editingFeedback.strengths}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[80px] text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{feedback.strengths}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Areas to Improve</h4>
                      {editingFeedback.id === feedback.id ? (
                        <textarea
                          name="areasToImprove"
                          value={editingFeedback.areasToImprove}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[80px] text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">{feedback.areasToImprove}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Overall Sentiment</h4>
                      {editingFeedback.id === feedback.id ? (
                        <select
                          name="sentiment"
                          value={editingFeedback.sentiment}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                        >
                          <option value="positive">Positive</option>
                          <option value="neutral">Neutral</option>
                          <option value="negative">Negative</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          feedback.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          feedback.sentiment === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackGiven;