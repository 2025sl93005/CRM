import { useEffect, useState } from 'react'
import { getMyIssues, submitFeedback } from '../../api/endpoints'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function FeedbackForm() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState([])
  const [form, setForm] = useState({ issueId: '', rating: 5, comment: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMyIssues().then((r) => {
      const resolved = r.data.data.filter(
        (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
      )
      setIssues(resolved)
      if (resolved.length > 0) setForm((f) => ({ ...f, issueId: resolved[0].id }))
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitFeedback({ ...form, issueId: Number(form.issueId) })
      toast.success('Feedback submitted. Thank you!')
      navigate('/customer/issues')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Submit Feedback</h1>
      {issues.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          No resolved issues available for feedback.
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Select Issue</label>
              <select
                className="input" value={form.issueId}
                onChange={(e) => setForm({ ...form, issueId: e.target.value })}
              >
                {issues.map((i) => (
                  <option key={i.id} value={i.id}>#{i.id} — {i.issueTitle}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rating</label>
              <div className="flex gap-2 mt-1">
                {stars.map((s) => (
                  <button
                    key={s} type="button"
                    onClick={() => setForm({ ...form, rating: s })}
                    className={`text-2xl transition-transform hover:scale-110 ${
                      s <= form.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500 self-center">
                  {form.rating}/5
                </span>
              </div>
            </div>
            <div>
              <label className="label">Comment (optional)</label>
              <textarea
                className="input min-h-[100px] resize-y" value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Tell us about your experience..."
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
