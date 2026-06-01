import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const roleRedirect = {
  CUSTOMER: '/customer/dashboard',
  CSR: '/csr/dashboard',
  MANAGER: '/manager/dashboard',
}

export default function Register() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'CUSTOMER'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await register(form)
      const data = res.data.data
      loginUser(data)
      toast.success('Account created successfully!')
      navigate(roleRedirect[data.role] || '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">ResolveAI</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create your account</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input
                  className="input" value={form.firstName} required
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  className="input" value={form.lastName} required
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email" className="input" value={form.email} required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" className="input" value={form.password} required minLength={6}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                className="input" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="CSR">Customer Service Representative</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
