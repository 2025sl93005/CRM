import { useEffect, useState } from 'react'
import { getMyIssues } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import StatCard from '../../components/StatCard'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])

  useEffect(() => {
    getMyIssues().then((r) => setIssues(r.data.data))
  }, [])

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'RESOLVED').length
  const open = issues.filter((i) => i.status === 'OPEN').length
  const escalated = issues.filter((i) => i.status === 'ESCALATED').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your support issues</p>
        </div>
        <Link to="/customer/create-issue" className="btn-primary">+ New Issue</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issues" value={total} icon={FileText} color="blue" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="green" />
        <StatCard title="Open" value={open} icon={Clock} color="yellow" />
        <StatCard title="Escalated" value={escalated} icon={AlertCircle} color="red" />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Issues</h2>
        {issues.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No issues logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Priority</th>
                  <th className="pb-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {issues.slice(0, 10).map((issue) => (
                  <tr key={issue.id}>
                    <td className="py-3 pr-4 font-medium">{issue.issueTitle}</td>
                    <td className="py-3 pr-4 text-gray-500">{issue.issueType?.replace('_', ' ')}</td>
                    <td className="py-3 pr-4"><StatusBadge status={issue.status} /></td>
                    <td className="py-3 pr-4"><PriorityBadge priority={issue.priority} /></td>
                    <td className="py-3 text-gray-400">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
