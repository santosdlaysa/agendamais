import { useState, useRef, useEffect } from 'react'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  Calendar,
  LogOut,
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  ChevronDown,
  Menu,
  X,
  UserCheck
} from 'lucide-react'
import { NotificationBell } from '../../components/notifications'

export default function ProfessionalLayout() {
  const { professional, logout } = useProfessionalAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef(null)

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu mobile quando a rota muda
  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/profissional/login')
  }

  const navItems = [
    { path: '/profissional/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/profissional/agenda', icon: CalendarDays, label: 'Minha Agenda' },
    { path: '/profissional/clientes', icon: Users, label: 'Meus Clientes' },
    { path: '/profissional/configuracoes', icon: Settings, label: 'Configuracoes' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-md text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-100"
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-lg font-bold text-jet-black-900">
                    Agendar Mais
                  </h1>
                  <p className="text-xs text-emerald-600 font-medium">Portal do Profissional</p>
                </div>
              </div>
            </div>

            {/* Notifications and User menu */}
            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <NotificationBell />

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-jet-black-100 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: professional?.color || '#10B981' }}
                >
                  <span className="text-white text-sm font-medium">
                    {professional?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-jet-black-900">{professional?.name}</p>
                  <p className="text-xs text-jet-black-500">{professional?.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-jet-black-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-jet-black-900">{professional?.name}</p>
                    <p className="text-xs text-jet-black-500">{professional?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                      <UserCheck className="w-3 h-3" />
                      {professional?.role}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        navigate('/profissional/configuracoes')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-100"
                    >
                      <Settings className="w-4 h-4" />
                      Configuracoes
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white border-b transition-all duration-300 overflow-hidden ${mobileNavOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 lg:space-x-8 py-3 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-jet-black-500 hover:text-jet-black-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
