import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQueueIssues, pullFromQueue } from '../../api/endpoints'
import { PriorityBadge } from '../../components/Badges'
import toast from 'react-hot-toast'

export default function QueueIssues() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => { reload() }, [])

  const handleRowClick = (issueId) => {
    navigate(`/issue/${issueId}/detail`)
  }

  const reload = () => {
    getQueueIssues().then((r) => setIssues(r.data.data))
  }

  const handlePull = async (id) => {
    try {
      await pullFromQueue(id)
      toast.success('Issue pulled from queue. You are now assigned!')
      reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to pull issue')
    }
  }

  const filtered = issues.filter((i) =>
    i.issueTitle.toLowerCase().includes(search.toLowerCase()) ||
    i.customerName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Queue Issues</h1>
      <input
        className="input max-w-sm" placeholder="Search queue..."
        value={search} onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-3">
        {filtered.map((issue) => (
          <div key={issue.id} className="card flex items-start justify-between gap-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleRowClick(issue.id)}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{issue.issueTitle}</span>
                <PriorityBadge priority={issue.priority} />
              </div>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.issueDescription}</p>
              <p className="text-xs text-gray-400 mt-2">
                {issue.customerName} · {new Date(issue.createdAt).toLocaleString()}
              </p>
            </div>
            <button className="btn-success text-sm whitespace-nowrap" onClick={(e) => { e.stopPropagation(); handlePull(issue.id); }}>
              Pull & Assign
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-gray-400">Queue is empty. All issues assigned!</div>
        )}
      </div>
    </div>
  )
}
