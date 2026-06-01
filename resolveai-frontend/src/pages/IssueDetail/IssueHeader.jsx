import React from 'react';

export default function IssueHeader({ issue }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{issue.issueTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">Ticket ID: TICKET-{String(issue.id).padStart(3, '0')}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border font-semibold ${getPriorityColor(issue.priority)}`}>
          {issue.priority?.toUpperCase() || 'UNSET'}
        </div>
      </div>

      <div className="bg-gray-50 rounded p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{issue.issueDescription}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">Type</p>
          <p className="text-gray-900 font-semibold">{issue.issueType?.replace(/_/g, ' ') || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Status</p>
          <p className="text-gray-900 font-semibold">{issue.status?.replace(/_/g, ' ') || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Created By</p>
          <p className="text-gray-900 font-semibold">{issue.customerName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 font-medium">Created On</p>
          <p className="text-gray-900 font-semibold text-sm">{formatDate(issue.createdAt)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
        <p>Last updated: {formatDate(issue.updatedAt)}</p>
      </div>
    </div>
  );
}
