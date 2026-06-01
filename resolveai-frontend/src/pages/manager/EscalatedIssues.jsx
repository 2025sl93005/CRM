import { useEffect, useState } from 'react'
import { getEscalatedIssues } from '../../api/endpoints'
import { StatusBadge, PriorityBadge } from '../../components/Badges'

export default function EscalatedIssues() {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    getEscalatedIssues().then((r) => setIssues(r.data.data))
  }, [])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Escalated Issues</h1>
      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="card text-center py-12 text-gray-400">No escalated issues at the moment.</div>
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="card">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-lg">{issue.issueTitle}</span>
                    <StatusBadge status={issue.status} />
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By {issue.customerName} · #{issue.id}
                  </p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Escalation Reason:</p>
                <p className="text-sm text-red-600 dark:text-red-400">{issue.escalationReason}</p>
              </div>
              <p className="text-xs text-gray-400">
                Description: {issue.issueDescription}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
