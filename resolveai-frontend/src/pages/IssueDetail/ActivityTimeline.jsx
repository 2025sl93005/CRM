import React from 'react';

export default function ActivityTimeline({ activities = [] }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (actionType) => {
    switch (actionType?.toUpperCase()) {
      case 'CREATED':
        return '📝';
      case 'ASSIGNED':
        return '👤';
      case 'STATUS_UPDATED':
        return '🔄';
      case 'ESCALATED':
        return '⬆️';
      case 'RESOLVED':
        return '✅';
      case 'COMMENT_ADDED':
        return '💬';
      case 'CLOSED':
        return '🔒';
      default:
        return '📌';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Activity Timeline</h3>
        <div className="text-center py-8">
          <p className="text-gray-600">No activities yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Activity Timeline</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="text-2xl">{getActivityIcon(activity.actionType)}</div>
              {index < activities.length - 1 && (
                <div className="w-1 h-12 bg-gray-300 mt-2"></div>
              )}
            </div>

            {/* Activity content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {activity.actionType?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-gray-700 mt-1">{activity.actionDescription}</p>

                  {activity.createdByName && (
                    <p className="text-sm text-gray-600 mt-2">
                      by <span className="font-medium">{activity.createdByName}</span>
                      {activity.createdByRole && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {activity.createdByRole?.replace(/_/g, ' ')}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(activity.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
