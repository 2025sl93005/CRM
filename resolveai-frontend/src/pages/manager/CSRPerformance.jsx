import { useEffect, useState } from 'react'
import { getCsrPerformance } from '../../api/endpoints'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function CsrPerformance() {
  const [csrs, setCsrs] = useState([])

  useEffect(() => {
    getCsrPerformance().then((r) => setCsrs(r.data.data))
  }, [])

  const chartData = csrs.map((c) => ({
    name: c.csrName.split(' ')[0],
    Resolved: c.resolvedIssues,
    Pending: c.pendingIssues,
    Rating: (c.avgFeedbackRating * 10).toFixed(0)
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CSR Performance Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Resolved vs Pending Issues</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Resolved" fill="#10b981" />
              <Bar dataKey="Pending" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Rating Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Rating" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Detailed Performance</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 text-gray-500 dark:text-gray-400 text-left">
              <th className="pb-3 pr-4">CSR Name</th>
              <th className="pb-3 pr-4">Total Issues</th>
              <th className="pb-3 pr-4">Resolved</th>
              <th className="pb-3 pr-4">Pending</th>
              <th className="pb-3 pr-4">Escalations</th>
              <th className="pb-3 pr-4">Avg Resolution Time</th>
              <th className="pb-3">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {csrs.map((csr) => (
              <tr key={csr.csrId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-3 pr-4 font-medium">{csr.csrName}</td>
                <td className="py-3 pr-4">{csr.totalIssues}</td>
                <td className="py-3 pr-4 text-green-600 font-medium">{csr.resolvedIssues}</td>
                <td className="py-3 pr-4 text-yellow-600">{csr.pendingIssues}</td>
                <td className="py-3 pr-4 text-red-600">{csr.escalationCount}</td>
                <td className="py-3 pr-4">{csr.avgResolutionTimeHours.toFixed(1)}h</td>
                <td className="py-3 font-semibold text-blue-600">★ {csr.avgFeedbackRating.toFixed(1)}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
        {csrs.length === 0 && <p className="text-center text-gray-400 py-8">No CSR data available</p>}
      </div>
    </div>
  )
}
