import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { NavLink, useLocation } from 'react-router-dom'
import { Calendar, LogOut, Users, UserCheck, Briefcase, FileText, BarChart3, MessageSquare, CreditCard, ChevronDown, Building2, Shield, Menu } from 'lucide-react'
import api from '../utils/api'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const { hasActiveSubscription, isInTrial, getTrialDaysRemaining } = useSubscription()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const userMenuRef = useRef(null)

  // Fechar menu do usuário ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar sidebar mobile quando a rota muda
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Buscar nome da empresa
  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const response = await api.get('/auth/business')
        const data = response.data.business || response.data
        if (data.business_name) {
          setBusinessName(data.business_name)
        }
      } catch (error) {
        // Silenciosamente falha - mostra fallback
      }
    }
    fetchBusinessName()
  }, [])

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-periwinkle-100 text-periwinkle-700'
        : 'text-jet-black-600 hover:bg-jet-black-100 hover:text-jet-black-900'
    }`

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-jet-black-200">
        <Calendar className="h-8 w-8 text-periwinkle-600 flex-shrink-0" />
        <h1 className="ml-3 text-lg font-bold text-jet-black-900 truncate">
          {businessName || 'AgendaMais'}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Dia a dia do negócio */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
            Dia a dia
          </p>
          <div className="space-y-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
              Dashboard
            </NavLink>
            <NavLink to="/appointments" className={navLinkClass}>
              <Calendar className="h-5 w-5 mr-3 flex-shrink-0" />
              Agendamentos
            </NavLink>
            <NavLink to="/reminders" className={navLinkClass} title="Envie lembretes automáticos para seus clientes">
              <MessageSquare className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col">
                <span>Lembretes</span>
                <span className="text-xs text-jet-black-400 font-normal">Notifique seus clientes</span>
              </div>
            </NavLink>
            <NavLink to="/reports" className={navLinkClass}>
              <BarChart3 className="h-5 w-5 mr-3 flex-shrink-0" />
              Relatórios
            </NavLink>
          </div>
        </div>

        {/* Cadastros */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
            Cadastros
          </p>
          <div className="space-y-1">
            <NavLink to="/clients" className={navLinkClass}>
              <Users className="h-5 w-5 mr-3 flex-shrink-0" />
              Clientes
            </NavLink>
            <NavLink to="/professionals" className={navLinkClass}>
              <UserCheck className="h-5 w-5 mr-3 flex-shrink-0" />
              Profissionais
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              <Briefcase className="h-5 w-5 mr-3 flex-shrink-0" />
              Serviços
            </NavLink>
          </div>
        </div>

        {/* Plano */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
            Plano
          </p>
          <div className="space-y-1">
            <NavLink
              to={hasActiveSubscription() ? "/subscription/manage" : "/subscription/plans"}
              className={navLinkClass}
            >
              <CreditCard className="h-5 w-5 mr-3 flex-shrink-0" />
              {hasActiveSubscription() ? 'Assinatura' : 'Assinar'}
            </NavLink>
          </div>
        </div>

        {/* Configurações */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
            Configurações
          </p>
          <div className="space-y-1">
            <NavLink to="/settings?tab=business" className={navLinkClass}>
              <Building2 className="h-5 w-5 mr-3 flex-shrink-0" />
              Empresa
            </NavLink>
            {user?.role === 'admin' && (
              <>
                <NavLink to="/settings?tab=permissions" className={navLinkClass}>
                  <Shield className="h-5 w-5 mr-3 flex-shrink-0" />
                  Permissões
                </NavLink>
                <NavLink to="/settings?tab=users" className={navLinkClass}>
                  <Users className="h-5 w-5 mr-3 flex-shrink-0" />
                  Usuários
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-jet-black-200 p-3">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-jet-black-100 transition-colors"
          >
            <div className="w-9 h-9 bg-periwinkle-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-jet-black-900 truncate">{user?.name}</p>
              {isInTrial() && (
                <p className="text-xs text-periwinkle-600">
                  Trial: {getTrialDaysRemaining()} dias
                </p>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-jet-black-500 transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border py-1 z-50">
              {/* User Info */}
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-jet-black-900">{user?.name}</p>
                <p className="text-xs text-jet-black-500 truncate">{user?.email}</p>
                {isInTrial() && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-periwinkle-100 text-periwinkle-700 text-xs rounded-full">
                    Trial: {getTrialDaysRemaining()} dias restantes
                  </span>
                )}
              </div>

              {/* Logout */}
              <div className="py-1">
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
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile (drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - Desktop (fixed) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-jet-black-200">
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-jet-black-600 hover:text-jet-black-900 hover:bg-jet-black-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center">
              <Calendar className="h-7 w-7 text-periwinkle-600" />
              <span className="ml-2 text-lg font-bold text-jet-black-900">
                {businessName || 'AgendaMais'}
              </span>
            </div>

            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
