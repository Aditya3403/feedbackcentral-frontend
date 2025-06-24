"use client"
import ProtectedRoute from '../../../../auth/ProtectedRoute';
import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';

type Feedback = {
  id: string;
  sno: number;
  date: string;
  feedback: string;
  status: 'pending' | 'acknowledged';
};

const FeedbackReceived = () => {
  const [selectedManager, setSelectedManager] = useState<string>('');
  const companyName = "Acme Corporation";

  const managers = [
    { id: '1', name: 'Sarah Johnson' },
    { id: '2', name: 'Michael Chen' },
    { id: '3', name: 'David Wilson' },
  ];

  const feedbackData: Feedback[] = [
    { id: '1', sno: 1, date: '2025-06-15', feedback: 'Great work on the project presentation. Your attention to detail was impressive.', status: 'pending' },
    { id: '2', sno: 2, date: '2025-06-10', feedback: 'Need improvement in meeting deadlines. Let\'s work on time management.', status: 'pending' },
    { id: '3', sno: 3, date: '2025-06-05', feedback: 'Excellent collaboration with the design team this week.', status: 'pending' },
  ];

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
      header: 'Feedback',
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="text-gray-700 line-clamp-2">{row.original.feedback}</p>
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
              onClick={() => handleAcknowledge(row.original.id)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
              title="Acknowledge"
            >
              <Check size={18} />
            </button>
          )}
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: feedbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAcknowledge = (feedbackId: string) => {
    console.log('Acknowledged feedback:', feedbackId);
  };

  const handleDelete = (feedbackId: string) => {
    console.log('Deleted feedback:', feedbackId);
  };

  return (
    <ProtectedRoute>
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Feedback Received</h2>
      
      {/* Manager selection section */}
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
              <label htmlFor="manager-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Manager
              </label>
              <select
                id="manager-select"
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback table */}
      <div className="overflow-x-auto">
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
              <tr key={row.id} className={row.original.status === 'acknowledged' ? 'bg-gray-50' : ''}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {feedbackData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No feedback received yet. Select a manager to view feedback.
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
};

export default FeedbackReceived;