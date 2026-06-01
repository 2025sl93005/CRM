import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Moon, Sun, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = {
  CUSTOMER: [
    { to: '/customer/dashboard', label: 'Dashboard' },
    { to: '/customer/create-issue', label: 'New Issue' },
    { to: '/customer/issues', label: 'My Issues' },
  ],
  CSR: [
    { to: '/csr/dashboard', label: 'Dashboard' },
    { to: '/csr/assigned', label: 'Assigned Issues' },
    { to: '/csr/queue', label: 'Queue' },
  ],
  MANAGER: [
    { to: '/manager/dashboard', label: 'Dashboard' },
    { to: '/manager/issues', label: 'All Issues' },
    { to: '/manager/assign', label: 'Assign CSR' },
    { to: '/manager/escalated', label: 'Escalated' },
    { to: '/manager/reports', label: 'Reports' },
    { to: '/manager/performance', label: 'Performance' },
  ],
}

export default function Navbar() {
  const { user, logoutUser, darkMode, setDarkMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = navLinks[user?.role] || []

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              ResolveAI
            </span>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {user.firstName} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 pb-3">
          <div className="px-4 pt-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
