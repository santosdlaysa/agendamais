import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { NavLink, useNavigate } from 'react-router-dom'
import { Calendar, LogOut, Users, UserCheck, Briefcase, FileText, BarChart3, MessageSquare, CreditCard, ChevronDown, User, Settings, Building2, Shield } from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { hasActiveSubscription, isInTrial, getTrialDaysRemaining } = useSubscription()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
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

  const handleMenuItemClick = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-xl font-bold text-gray-900">
                  Sistema de Agendamento
                </h1>
              </div>
            </div>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  {isInTrial() && (
                    <p className="text-xs text-blue-600">
                      Trial: {getTrialDaysRemaining()} dias
                    </p>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    {isInTrial() && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Trial: {getTrialDaysRemaining()} dias restantes
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuItemClick('/subscription/manage')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CreditCard className="w-4 h-4" />
                      Minha Assinatura
                    </button>
                  </div>

                  {/* Configurações da Empresa */}
                  <div className="border-t py-1">
                    <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase">Configurações</p>
                    <button
                      onClick={() => handleMenuItemClick('/settings?tab=business')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Building2 className="w-4 h-4" />
                      Empresa
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleMenuItemClick('/settings?tab=permissions')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Shield className="w-4 h-4" />
                          Permissões
                        </button>
                        <button
                          onClick={() => handleMenuItemClick('/settings?tab=users')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Users className="w-4 h-4" />
                          Usuários
                        </button>
                      </>
                    )}
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
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </NavLink>
            <NavLink
              to="/professionals"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Profissionais
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Serviços
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendamentos
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </NavLink>
            <NavLink
              to="/reminders"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Lembretes
            </NavLink>
            <NavLink
              to={hasActiveSubscription() ? "/subscription/manage" : "/subscription/plans"}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {hasActiveSubscription() ? 'Assinatura' : 'Assinar'}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}