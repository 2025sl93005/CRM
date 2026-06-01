import { useEffect, useState } from 'react'
import { getReport } from '../../api/endpoints'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import StatCard from '../../components/StatCard'
import { Download, BarChart3, TrendingUp, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6b7280']

export default function Reports() {
  const [report, setReport] = useState(null)

  useEffect(() => {
    getReport().then((r) => setReport(r.data.data))
  }, [])

  const statusData = report ? Object.entries(report.issueStatusSummary).map(([k, v]) => ({
    name: k.replace('_', ' '),
    value: v
  })) : []

  const handleCsvExport = () => {
    if (!report) return
    let csv = 'ResolveAI - System Report\n\n'
    csv += 'SUMMARY\n'
    csv += `Total Issues,${report.totalIssues}\n`
    csv += `Resolved,${report.totalResolved}\n`
    csv += `Escalated,${report.totalEscalated}\n`
    csv += `Avg Rating,${report.overallAvgRating?.toFixed(1) || 'N/A'}\n\n`
    
    csv += 'CSR PERFORMANCE\n'
    csv += 'Name,Email,Total,Resolved,Pending,Escalations,Avg Resolution Time (hrs),Avg Rating\n'
    report.csrPerformance?.forEach(c => {
      csv += `${c.csrName},${c.csrEmail},${c.totalIssues},${c.resolvedIssues},${c.pendingIssues},${c.escalationCount},${c.avgResolutionTimeHours.toFixed(1)},${c.avgFeedbackRating.toFixed(1)}\n`
    })
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'report.csv'
    a.click()
    toast.success('Report exported as CSV')
  }

  if (!report) {
    return <div className="card text-center py-12 text-gray-400">Loading report...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button className="btn-primary flex items-center gap-2" onClick={handleCsvExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issues" value={report.totalIssues} icon={BarChart3} color="blue" />
        <StatCard title="Resolved" value={report.totalResolved} icon={TrendingUp} color="green" />
        <StatCard title="Escalated" value={report.totalEscalated} icon={BarChart3} color="red" />
        <StatCard title="Avg Rating" value={report.overallAvgRating?.toFixed(1)} icon={TrendingUp} color="purple" subtitle="out of 5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Issue Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{ fontSize: '12px' }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">CSR Performance Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-gray-500 dark:text-gray-400">
                <th className="pb-3 pr-4 text-left">CSR Name</th>
                <th className="pb-3 pr-4 text-center">Total</th>
                <th className="pb-3 pr-4 text-center">Resolved</th>
                <th className="pb-3 pr-4 text-center">Pending</th>
                <th className="pb-3 pr-4 text-center">Escalated</th>
                <th className="pb-3 pr-4 text-center">Avg Time (hrs)</th>
                <th className="pb-3 pr-4 text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {report.csrPerformance?.map((csr) => (
                <tr key={csr.csrId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 pr-4">{csr.csrName}</td>
                  <td className="py-3 pr-4 text-center">{csr.totalIssues}</td>
                  <td className="py-3 pr-4 text-center font-medium text-green-600">{csr.resolvedIssues}</td>
                  <td className="py-3 pr-4 text-center text-yellow-600">{csr.pendingIssues}</td>
                  <td className="py-3 pr-4 text-center text-red-600">{csr.escalationCount}</td>
                  <td className="py-3 pr-4 text-center">{csr.avgResolutionTimeHours.toFixed(1)}</td>
                  <td className="py-3 pr-4 text-center font-semibold text-blue-600">★ {csr.avgFeedbackRating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
