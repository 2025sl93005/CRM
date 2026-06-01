import { useEffect, useState } from 'react'
import { getAllIssues, getCsrPerformance } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import { Link } from 'react-router-dom'
import { AlertCircle, Users, CheckCircle, TrendingUp } from 'lucide-react'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [csrs, setCsrs] = useState([])

  useEffect(() => {
    getAllIssues().then((r) => setIssues(r.data.data))
    getCsrPerformance().then((r) => setCsrs(r.data.data))
  }, [])

  const escalated = issues.filter((i) => i.status === 'ESCALATED').length
  const totalIssues = issues.length
  const resolved = issues.filter((i) => i.status === 'RESOLVED').length
  const avgRating = csrs.length > 0
    ? (csrs.reduce((sum, c) => sum + c.avgFeedbackRating, 0) / csrs.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issues" value={totalIssues} icon={AlertCircle} color="blue" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="green" />
        <StatCard title="Escalated" value={escalated} icon={AlertCircle} color="red" />
        <StatCard title="Avg Rating" value={avgRating} icon={TrendingUp} color="purple" subtitle="out of 5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/manager/issues" className="block btn-primary text-center">View All Issues</Link>
            <Link to="/manager/assign" className="block btn-secondary text-center">Assign Issues</Link>
            <Link to="/manager/escalated" className="block text-center px-4 py-2 rounded-lg border border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20">
              View Escalated ({escalated})
            </Link>
            <Link to="/manager/reports" className="block btn-secondary text-center">View Reports</Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Team ({csrs.length} CSRs)</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {csrs.length === 0 ? (
              <p className="text-gray-400 text-sm">No CSRs available</p>
            ) : (
              csrs.slice(0, 5).map((csr) => (
                <div key={csr.csrId} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div>
                    <p className="font-medium">{csr.csrName}</p>
                    <p className="text-xs text-gray-400">{csr.totalIssues} issues • {csr.resolvedIssues} resolved</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">★ {csr.avgFeedbackRating.toFixed(1)}</span>
                </div>
              ))
            )}
          </div>
          <Link to="/manager/performance" className="text-sm text-blue-600 hover:underline mt-2 block">
            Full performance report →
          </Link>
        </div>
      </div>
    </div>
  )
}
