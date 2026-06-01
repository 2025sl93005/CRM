import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssignedIssues, updateStatus, escalateIssue } from '../../api/endpoints'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['IN_PROGRESS','ACCEPTED','RESOLVED','REJECTED','CLOSED']

export default function AssignedIssues() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [search, setSearch] = useState('')
  const [escalatingId, setEscalatingId] = useState(null)
  const [escalationReason, setEscalationReason] = useState('')

  useEffect(() => { reload() }, [])

  const handleRowClick = (issueId) => {
    navigate(`/issue/${issueId}/detail`)
  }

  const reload = () => {
    getAssignedIssues().then((r) => setIssues(r.data.data))
  }

  const handleStatus = async (id, status) => {
    try {
      await updateStatus(id, { status })
      toast.success(`Status updated to ${status.replace('_',' ')}`)
      reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status')
    }
  }

  const handleEscalate = async (id) => {
    if (!escalationReason.trim()) { toast.error('Escalation reason required'); return }
    try {
      await escalateIssue(id, { escalationReason })
      toast.success('Issue escalated to manager')
      setEscalatingId(null)
      setEscalationReason('')
      reload()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Escalation failed')
    }
  }

  const filtered = issues.filter((i) =>
    i.issueTitle.toLowerCase().includes(search.toLowerCase()) ||
    i.customerName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Assigned Issues</h1>
      <input
        className="input max-w-sm" placeholder="Search by title or customer..."
        value={search} onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-4">
        {filtered.map((issue) => (
          <div key={issue.id} className="card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleRowClick(issue.id)}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-lg">{issue.issueTitle}</span>
                  <StatusBadge status={issue.status} />
                  <PriorityBadge priority={issue.priority} />
                </div>
                <p className="text-sm text-gray-500 mt-1">{issue.issueDescription}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Customer: {issue.customerName} · #{issue.id} · {new Date(issue.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(issue.id, s)}
                    disabled={issue.status === s}
                    className={`text-xs py-1 px-2 rounded-md border transition-colors ${
                      issue.status === s
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                  >
                    {s.replace('_',' ')}
                  </button>
                ))}
                {issue.status !== 'ESCALATED' && issue.status !== 'RESOLVED' && issue.status !== 'CLOSED' && (
                  <button
                    className="text-xs py-1 px-2 rounded-md border border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30"
                    onClick={() => setEscalatingId(escalatingId === issue.id ? null : issue.id)}
                  >
                    Escalate
                  </button>
                )}
              </div>
            </div>

            {escalatingId === issue.id && (
              <div className="mt-4 flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                <input
                  className="input flex-1 min-w-0"
                  placeholder="Reason for escalation..."
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                />
                <button className="btn-danger text-sm" onClick={() => handleEscalate(issue.id)}>
                  Confirm Escalate
                </button>
                <button className="btn-secondary text-sm" onClick={() => setEscalatingId(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-gray-400">No assigned issues found.</div>
        )}
      </div>
    </div>
  )
}
