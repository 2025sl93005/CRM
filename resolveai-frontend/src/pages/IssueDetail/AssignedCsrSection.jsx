import React from 'react';

export default function AssignedCsrSection({ assignedCsrId, assignedCsrName, assignedCsrEmail }) {
  if (!assignedCsrId) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Assigned CSR</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">📋 Unassigned</p>
          <p className="text-sm text-yellow-700 mt-2">This issue is currently in the queue and not assigned to any CSR yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Assigned CSR</h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {assignedCsrName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{assignedCsrName}</p>
              <p className="text-sm text-gray-600">{assignedCsrEmail}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">CSR ID</span>
            <span className="font-semibold text-gray-900">{assignedCsrId}</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <p className="text-green-800 text-sm">✅ This issue is assigned and being worked on.</p>
        </div>
      </div>
    </div>
  );
}
