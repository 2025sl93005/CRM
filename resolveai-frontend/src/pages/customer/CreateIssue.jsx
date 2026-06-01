import { useState } from 'react'
import { createIssue } from '../../api/endpoints'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CreateIssue() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    issueTitle: '', issueDescription: '', issueType: 'COMPLAINT'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createIssue(form)
      toast.success('Issue created successfully!')
      navigate('/customer/issues')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create issue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Log a New Issue</h1>
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Issue Title</label>
            <input
              className="input" required value={form.issueTitle}
              onChange={(e) => setForm({ ...form, issueTitle: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>
          <div>
            <label className="label">Issue Type</label>
            <select
              className="input" value={form.issueType}
              onChange={(e) => setForm({ ...form, issueType: e.target.value })}
            >
              <option value="COMPLAINT">Complaint</option>
              <option value="SUGGESTION">Suggestion</option>
              <option value="GOODWILL_SHARING">Goodwill Sharing</option>
            </select>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input min-h-[120px] resize-y" required value={form.issueDescription}
              onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
              placeholder="Please describe your issue in detail..."
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Issue'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/customer/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
