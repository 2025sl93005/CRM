import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'

// Issue Detail Page
import IssueDetail from './pages/IssueDetail'

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CreateIssue from './pages/customer/CreateIssue'
import MyIssues from './pages/customer/MyIssues'
import FeedbackForm from './pages/customer/FeedbackForm'

// CSR Pages
import CsrDashboard from './pages/csr/CsrDashboard'
import AssignedIssues from './pages/csr/AssignedIssues'
import QueueIssues from './pages/csr/QueueIssues'

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import AllIssues from './pages/manager/AllIssues'
import AssignCsr from './pages/manager/AssignCsr'
import EscalatedIssues from './pages/manager/EscalatedIssues'
import Reports from './pages/manager/Reports'
import CsrPerformance from './pages/manager/CSRPerformance'

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
        <p className="text-gray-600 dark:text-gray-400">Unauthorized. You don't have access to this page.</p>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes with Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/create-issue" element={<ProtectedRoute roles={['CUSTOMER']}><CreateIssue /></ProtectedRoute>} />
        <Route path="/customer/issues" element={<ProtectedRoute roles={['CUSTOMER']}><MyIssues /></ProtectedRoute>} />
        <Route path="/customer/feedback" element={<ProtectedRoute roles={['CUSTOMER']}><FeedbackForm /></ProtectedRoute>} />

        {/* CSR Routes */}
        <Route path="/csr/dashboard" element={<ProtectedRoute roles={['CSR']}><CsrDashboard /></ProtectedRoute>} />
        <Route path="/csr/assigned" element={<ProtectedRoute roles={['CSR']}><AssignedIssues /></ProtectedRoute>} />
        <Route path="/csr/queue" element={<ProtectedRoute roles={['CSR']}><QueueIssues /></ProtectedRoute>} />

        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ProtectedRoute roles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/manager/issues" element={<ProtectedRoute roles={['MANAGER']}><AllIssues /></ProtectedRoute>} />
        <Route path="/manager/assign" element={<ProtectedRoute roles={['MANAGER']}><AssignCsr /></ProtectedRoute>} />
        <Route path="/manager/escalated" element={<ProtectedRoute roles={['MANAGER']}><EscalatedIssues /></ProtectedRoute>} />
        <Route path="/manager/reports" element={<ProtectedRoute roles={['MANAGER']}><Reports /></ProtectedRoute>} />
        <Route path="/manager/performance" element={<ProtectedRoute roles={['MANAGER']}><CsrPerformance /></ProtectedRoute>} />

        {/* Shared Routes */}
        <Route path="/issue/:id/detail" element={<ProtectedRoute roles={['CUSTOMER', 'CSR', 'MANAGER']}><IssueDetail /></ProtectedRoute>} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  )
}
