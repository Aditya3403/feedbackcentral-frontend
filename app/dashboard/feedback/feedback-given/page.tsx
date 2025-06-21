"use client"

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';

type TeamMember = {
  id: string;
  name: string;
  email: string;
  feedback: string;
};

const FeedbackGiven = () => {
  // State for selected team
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Mock data - replace with your actual data
  const companyName = "Acme Corporation"; // Add your company name here
  const teams = [
    { id: '1', name: 'Development Team' },
    { id: '2', name: 'Design Team' },
    { id: '3', name: 'Marketing Team' },
  ];

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', feedback: '3 Given' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', feedback: '5 Given' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', feedback: '1 Given' },
  ];

  // Table columns configuration
  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'feedback',
      header: 'Feedback',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <button 
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          onClick={() => console.log('View feedback for', row.original.name)}
        >
          View All
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: teamMembers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddMember = () => {
    // Implement your add member logic here
    console.log('Adding member:', newMemberEmail);
    setIsAddMemberOpen(false);
    setNewMemberEmail('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6">Feedback Given</h2>
      
      {/* Team selection and add member section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                {companyName}
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Team
              </label>
              <select
                id="team-select"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setIsAddMemberOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={16} />
            Add Person
          </button>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      {/* Add Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add Team Member</h3>
            <div className="mb-4">
              <label htmlFor="member-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="member-email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="member@example.com"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team members table */}
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
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
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

      {teamMembers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No team members found. Select a team or add members.
        </div>
      )}
    </div>
  );
};

export default FeedbackGiven;