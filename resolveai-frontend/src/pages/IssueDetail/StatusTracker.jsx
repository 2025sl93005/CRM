import React from 'react';

export default function StatusTracker({ status }) {
  const statuses = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED'];
  const currentStatusIndex = statuses.indexOf(status?.toUpperCase() || 'OPEN');

  const getStatusIcon = (index, isActive, isCompleted) => {
    if (isCompleted) return '✅';
    if (isActive) return '🟠';
    return '⬜';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Status Tracker</h3>

      <div className="space-y-4">
        {statuses.map((s, index) => {
          const isActive = index === currentStatusIndex;
          const isCompleted = index < currentStatusIndex;

          return (
            <div key={s} className="flex items-center gap-4">
              <div className="text-2xl">
                {getStatusIcon(index, isActive, isCompleted)}
              </div>

              <div className="flex-1">
                <div className={`font-semibold ${
                  isActive ? 'text-orange-600' :
                  isCompleted ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {s.replace(/_/g, ' ')}
                </div>
                {isActive && <p className="text-sm text-gray-600">Current status</p>}
              </div>

              {index < statuses.length - 1 && (
                <div className={`w-1 h-8 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Current Status:</span> {status?.replace(/_/g, ' ') || 'N/A'}
        </p>
      </div>
    </div>
  );
}
