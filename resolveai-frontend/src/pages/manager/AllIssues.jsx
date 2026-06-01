import { useEffect, useState } from 'react'
import { getAllIssues, sendToQueue, getAllCsrs, assignIssue } from '../../api/endpoints'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import toast from 'react-hot-toast'

export default function AllIssues() {
  const [issues, setIssues] = useState([])
  const [csrs, setCsrs] = useState([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [assigningId, setAssigningId] = useState(null)
  const [selectedCsr, setSelectedCsr] = useState('')

  useEffect(() => {
    reload()
    getAllCsrs().then((r) => setCsrs(r.data.data))
  }, [])

  const reload = () => {
    getAllIssues().then((r) => setIssues(r.data.data))
  }

  const handleQueue = async (id) => {
    try {
      await sendToQueue(id)
      toast.success('Issue sent to common queue')
      reload()
    } catch (err) {
      toast.error('Failed to send to queue')
    }
  }

  const handleAssign = async (id) => {
    if (!selectedCsr) {
      toast.error('Select a CSR')
      return
    }
    try {
      await assignIssue(id, { csrId: Number(selectedCsr) })
      toast.success('Issue assigned')
      setAssigningId(null)
      setSelectedCsr('')
      reload()
    } catch (err) {
      toast.error('Assignment failed')
    }
  }

  const filtered = issues.filter((i) => {
    const matchSearch = i.issueTitle.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? i.status === filterStatus : true
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">All Issues</h1>
      <div className="flex flex-wrap gap-3">
        <input className="input max-w-xs" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input max-w-xs" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {['OPEN','IN_PROGRESS','ACCEPTED','RESOLVED','REJECTED','CLOSED','ESCALATED'].map(s => (
            <option key={s} value={s}>{s.replace('_',' ')}</option>
          ))}
        </select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left">
              <th className="pb-3 pr-4">#</th>
              <th className="pb-3 pr-4">Title</th>
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Priority</th>
              <th className="pb-3 pr-4">Assigned</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {filtered.map((issue) => (
              <tr key={issue.id}>
                <td className="py-3 pr-4 text-gray-400">{issue.id}</td>
                <td className="py-3 pr-4 font-medium max-w-xs truncate">{issue.issueTitle}</td>
                <td className="py-3 pr-4 text-gray-500">{issue.customerName}</td>
                <td className="py-3 pr-4"><StatusBadge status={issue.status} /></td>
                <td className="py-3 pr-4"><PriorityBadge priority={issue.priority} /></td>
                <td className="py-3 pr-4 text-gray-500">{issue.assignedCsrName || '—'}</td>
                <td className="py-3 flex gap-1 flex-wrap">
                  {assigningId === issue.id ? (
                    <div className="flex gap-1">
                      <select className="input text-xs py-1 px-2" value={selectedCsr} onChange={(e) => setSelectedCsr(e.target.value)}>
                        <option value="">Choose...</option>
                        {csrs.map((c) => (
                          <option key={c.id} value={c.id}>{c.firstName}</option>
                        ))}
                      </select>
                      <button className="text-xs btn-success py-1 px-2" onClick={() => handleAssign(issue.id)}>Go</button>
                    </div>
                  ) : (
                    <>
                      <button className="text-xs btn-primary py-1 px-2" onClick={() => setAssigningId(issue.id)}>Assign</button>
                      <button className="text-xs btn-secondary py-1 px-2" onClick={() => handleQueue(issue.id)}>Queue</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-400 py-8">No issues found</p>}
      </div>
    </div>
  )
}
