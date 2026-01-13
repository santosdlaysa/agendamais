import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Calendar, LogOut, Users, UserCheck, Briefcase, FileText, BarChart3, MessageSquare, CreditCard, ChevronDown, User, Settings, Building2, Shield, Menu, X } from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { hasActiveSubscription, isInTrial, getTrialDaysRemaining } = useSubscription()
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

  const handleMenuItemClick = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
  }

  return (
    <div className="min-h-screen bg-jet-black-50">
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
                <Calendar className="h-8 w-8 text-periwinkle-600" />
                <h1 className="ml-2 text-xl font-bold text-jet-black-900 hidden sm:block">
                  Sistema de Agendamento
                </h1>
              </div>
            </div>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-jet-black-100 transition-colors"
              >
                <div className="w-8 h-8 bg-periwinkle-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-jet-black-900">{user?.name}</p>
                  {isInTrial() && (
                    <p className="text-xs text-periwinkle-600">
                      Trial: {getTrialDaysRemaining()} dias
                    </p>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-jet-black-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-jet-black-900">{user?.name}</p>
                    <p className="text-xs text-jet-black-500">{user?.email}</p>
                    {isInTrial() && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-periwinkle-100 text-periwinkle-700 text-xs rounded-full">
                        Trial: {getTrialDaysRemaining()} dias restantes
                      </span>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => handleMenuItemClick('/subscription/manage')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-100"
                    >
                      <CreditCard className="w-4 h-4" />
                      Minha Assinatura
                    </button>
                  </div>

                  {/* Configurações da Empresa */}
                  <div className="border-t py-1">
                    <p className="px-4 py-1 text-xs font-medium text-jet-black-400 uppercase">Configurações</p>
                    <button
                      onClick={() => handleMenuItemClick('/settings?tab=business')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-100"
                    >
                      <Building2 className="w-4 h-4" />
                      Empresa
                    </button>
                    {user?.role === 'admin' && (
                      <>
                        <button
                          onClick={() => handleMenuItemClick('/settings?tab=permissions')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-100"
                        >
                          <Shield className="w-4 h-4" />
                          Permissões
                        </button>
                        <button
                          onClick={() => handleMenuItemClick('/settings?tab=users')}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-100"
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

      {/* Mobile Navigation */}
      <div className={`md:hidden bg-white border-b transition-all duration-300 overflow-hidden ${mobileNavOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 py-2 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <FileText className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <Users className="h-5 w-5 mr-3" />
            Clientes
          </NavLink>
          <NavLink
            to="/professionals"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <UserCheck className="h-5 w-5 mr-3" />
            Profissionais
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Serviços
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <Calendar className="h-5 w-5 mr-3" />
            Agendamentos
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Relatórios
          </NavLink>
          <NavLink
            to="/reminders"
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Lembretes
          </NavLink>
          <NavLink
            to={hasActiveSubscription() ? "/subscription/manage" : "/subscription/plans"}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-md text-base font-medium ${
                isActive
                  ? 'text-jet-black-900 bg-jet-black-100'
                  : 'text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-50'
              }`
            }
          >
            <CreditCard className="h-5 w-5 mr-3" />
            {hasActiveSubscription() ? 'Assinatura' : 'Assinar'}
          </NavLink>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 lg:space-x-8 py-3 overflow-x-auto">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <FileText className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink
              to="/clients"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </NavLink>
            <NavLink
              to="/professionals"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Profissionais
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Serviços
            </NavLink>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendamentos
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios
            </NavLink>
            <NavLink
              to="/reminders"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
                }`
              }
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Lembretes
            </NavLink>
            <NavLink
              to={hasActiveSubscription() ? "/subscription/manage" : "/subscription/plans"}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-jet-black-900 bg-jet-black-100'
                    : 'text-jet-black-500 hover:text-jet-black-900'
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