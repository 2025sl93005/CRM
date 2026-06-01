import { useEffect, useState } from 'react'
import { getMyIssues } from '../../api/endpoints'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import { Link } from 'react-router-dom'

export default function MyIssues() {
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    getMyIssues().then((r) => setIssues(r.data.data))
  }, [])

  const filtered = issues.filter((i) => {
    const matchSearch = i.issueTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? i.status === filterStatus : true
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Issues</h1>
        <Link to="/customer/create-issue" className="btn-primary">+ New Issue</Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="input max-w-xs" placeholder="Search issues..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input max-w-xs" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {['OPEN','IN_PROGRESS','ACCEPTED','RESOLVED','REJECTED','CLOSED','ESCALATED'].map(s => (
            <option key={s} value={s}>{s.replace('_',' ')}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
              <th className="pb-3 pr-4">#ID</th>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Priority</th>
              <th className="pb-3 pr-4">Assigned To</th>
              <th className="pb-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filtered.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 pr-4 text-gray-400">#{issue.id}</td>
                <td className="py-3 pr-4 font-medium">{issue.issueTitle}</td>
                <td className="py-3 pr-4 text-gray-500">{issue.issueType?.replace('_',' ')}</td>
                <td className="py-3 pr-4"><StatusBadge status={issue.status} /></td>
                <td className="py-3 pr-4"><PriorityBadge priority={issue.priority} /></td>
                <td className="py-3 pr-4 text-gray-500">{issue.assignedCsrName || '—'}</td>
                <td className="py-3 text-gray-400">{new Date(issue.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No issues found.</p>}
      </div>

      {/* Feedback button for resolved issues */}
      {issues.filter(i => i.status === 'RESOLVED').length > 0 && (
        <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">
            You have resolved issues. Share your feedback!
          </p>
          <Link to="/customer/feedback" className="btn-success text-sm">Give Feedback</Link>
        </div>
      )}
    </div>
  )
}
