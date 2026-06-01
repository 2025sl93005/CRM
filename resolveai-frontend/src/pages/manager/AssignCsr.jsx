import { useEffect, useState } from 'react'
import { getAllCsrs, getAllIssues, assignIssue } from '../../api/endpoints'
import toast from 'react-hot-toast'

export default function AssignCsr() {
  const [csrs, setCsrs] = useState([])
  const [issues, setIssues] = useState([])
  const [selected, setSelected] = useState({ issueId: '', csrId: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllCsrs().then((r) => {
      const csrData = r.data.data.map(c => ({ id: c.id, name: c.firstName + ' ' + c.lastName }))
      setCsrs(csrData)
    })
    getAllIssues().then((r) => {
      const unassigned = r.data.data.filter(i => !i.assignedCsrId)
      setIssues(unassigned)
    })
  }, [])

  const handleAssign = async () => {
    if (!selected.issueId || !selected.csrId) {
      toast.error('Select both issue and CSR')
      return
    }
    setLoading(true)
    try {
      await assignIssue(Number(selected.issueId), { csrId: Number(selected.csrId) })
      toast.success('Issue assigned successfully')
      setSelected({ issueId: '', csrId: '' })
      getAllIssues().then((r) => {
        const unassigned = r.data.data.filter(i => !i.assignedCsrId)
        setIssues(unassigned)
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Assign Issues to CSR</h1>
      <div className="card space-y-5">
        <div>
          <label className="label">Select Unassigned Issue</label>
          <select
            className="input" value={selected.issueId}
            onChange={(e) => setSelected({ ...selected, issueId: e.target.value })}
          >
            <option value="">Choose an issue...</option>
            {issues.map((i) => (
              <option key={i.id} value={i.id}>
                #{i.id} — {i.issueTitle} ({i.priority})
              </option>
            ))}
          </select>
          {issues.length === 0 && <p className="text-sm text-gray-400 mt-2">All issues are assigned!</p>}
        </div>

        <div>
          <label className="label">Select CSR</label>
          <select
            className="input" value={selected.csrId}
            onChange={(e) => setSelected({ ...selected, csrId: e.target.value })}
          >
            <option value="">Choose a CSR...</option>
            {csrs.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {csrs.length === 0 && <p className="text-sm text-gray-400 mt-2">No CSRs available</p>}
        </div>

        <button className="btn-primary w-full" onClick={handleAssign} disabled={loading || !selected.issueId || !selected.csrId}>
          {loading ? 'Assigning...' : 'Assign Issue'}
        </button>
      </div>
    </div>
  )
}
