import { useEffect, useState } from 'react'
import { getAssignedIssues } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import StatCard from '../../components/StatCard'
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CsrDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])

  useEffect(() => {
    getAssignedIssues().then((r) => setIssues(r.data.data))
  }, [])

  const total = issues.length
  const resolved = issues.filter((i) => i.status === 'RESOLVED').length
  const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS').length
  const escalated = issues.filter((i) => i.status === 'ESCALATED').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CSR Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, {user?.firstName}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Issues" value={total} icon={ListTodo} color="blue" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="yellow" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="green" />
        <StatCard title="Escalated" value={escalated} icon={AlertCircle} color="red" />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Assigned Issues</h2>
          <Link to="/csr/assigned" className="text-sm text-blue-600 hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {issues.slice(0, 8).map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 pr-4 font-medium">{issue.issueTitle}</td>
                  <td className="py-3 pr-4 text-gray-500">{issue.customerName}</td>
                  <td className="py-3 pr-4"><StatusBadge status={issue.status} /></td>
                  <td className="py-3"><PriorityBadge priority={issue.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {issues.length === 0 && <p className="text-center text-gray-400 py-8">No assigned issues.</p>}
        </div>
      </div>
    </div>
  )
}
