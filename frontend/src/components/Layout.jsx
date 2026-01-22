import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'
import { NavLink, useLocation } from 'react-router-dom'
import { Calendar, LogOut, Users, UserCheck, Briefcase, FileText, BarChart3, MessageSquare, CreditCard, ChevronDown, Building2, Shield, Menu, PanelLeftClose, PanelLeft, Crown, DollarSign } from 'lucide-react'
import api from '../utils/api'
import { NotificationBell } from './notifications'
import { Button } from './ui/button'

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const { hasActiveSubscription, isInTrial, getTrialDaysRemaining } = useSubscription()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const userMenuRef = useRef(null)
  const sidebarRef = useRef(null)

  // Persistir estado da sidebar colapsada
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

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

  const navLinkClass = ({ isActive }, collapsed = false) =>
    `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-periwinkle-100 text-periwinkle-700'
        : 'text-jet-black-600 hover:bg-jet-black-100 hover:text-jet-black-900'
    }`

  const getNavLinkClass = (collapsed) => ({ isActive }) => navLinkClass({ isActive }, collapsed)

  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex ${collapsed ? 'flex-col items-center justify-center py-3 gap-2' : 'flex-row items-center justify-between h-16 px-4'} border-b border-jet-black-200`}>
        <div className="flex items-center min-w-0">
          <Calendar className="h-8 w-8 text-periwinkle-600 flex-shrink-0" />
          {!collapsed && (
            <h1 className="ml-3 text-lg font-bold text-jet-black-900 truncate">
              {businessName || 'AgendaMais'}
            </h1>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-jet-black-400 hover:bg-jet-black-100 hover:text-jet-black-600 transition-colors flex-shrink-0"
          title={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-4 space-y-6 overflow-y-auto`}>
        {/* Dia a dia do negócio */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Dia a dia
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/dashboard" className={getNavLinkClass(collapsed)} title="Dashboard">
              <FileText className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Dashboard'}
            </NavLink>
            <NavLink to="/appointments" className={getNavLinkClass(collapsed)} title="Agendamentos">
              <Calendar className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Agendamentos'}
            </NavLink>
            <NavLink to="/reminders" className={getNavLinkClass(collapsed)} title="Lembretes - Notifique seus clientes">
              <MessageSquare className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && (
                <div className="flex flex-col">
                  <span>Lembretes</span>
                  <span className="text-xs text-jet-black-400 font-normal">Notifique seus clientes</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/reports" className={getNavLinkClass(collapsed)} title="Relatórios">
              <BarChart3 className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Relatórios'}
            </NavLink>
          </div>
        </div>

        {/* Cadastros */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Cadastros
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/clients" className={getNavLinkClass(collapsed)} title="Clientes">
              <Users className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Clientes'}
            </NavLink>
            <NavLink to="/professionals" className={getNavLinkClass(collapsed)} title="Profissionais">
              <UserCheck className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Profissionais'}
            </NavLink>
            <NavLink to="/services" className={getNavLinkClass(collapsed)} title="Serviços">
              <Briefcase className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Serviços'}
            </NavLink>
          </div>
        </div>

        {/* Plano */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Plano
            </p>
          )}
          <div className="space-y-1">
            <NavLink
              to={hasActiveSubscription() ? "/subscription/manage" : "/subscription/plans"}
              className={getNavLinkClass(collapsed)}
              title={hasActiveSubscription() ? 'Assinatura' : 'Assinar'}
            >
              <CreditCard className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && (hasActiveSubscription() ? 'Assinatura' : 'Assinar')}
            </NavLink>
          </div>
        </div>

        {/* Configurações */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Configurações
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/settings?tab=business" className={getNavLinkClass(collapsed)} title="Empresa">
              <Building2 className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Empresa'}
            </NavLink>
            {user?.role === 'admin' && (
              <>
                <NavLink to="/settings?tab=permissions" className={getNavLinkClass(collapsed)} title="Permissões">
                  <Shield className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!collapsed && 'Permissões'}
                </NavLink>
                <NavLink to="/settings?tab=users" className={getNavLinkClass(collapsed)} title="Usuários">
                  <Users className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                  {!collapsed && 'Usuários'}
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Super Admin - apenas para admins */}
        {(user?.role === 'admin' || user?.role === 'superadmin') && (
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-violet-500 uppercase tracking-wider">
                Super Admin
              </p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/superadmin/dashboard"
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-violet-600 hover:bg-violet-50 hover:text-violet-700'
                  }`
                }
                title="Painel Admin"
              >
                <Crown className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
                {!collapsed && 'Painel Admin'}
            </NavLink>
            {isAdmin() && (
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-500 hover:text-gray-900'
                  }`
                }
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Faturamento
              </NavLink>
            )}
          </div>
        </div>)}
      </nav>

      {/* User section at bottom */}
      <div className="border-t border-jet-black-200 p-3">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-lg hover:bg-jet-black-100 transition-colors`}
            title={collapsed ? user?.name : undefined}
          >
            <div className="w-9 h-9 bg-periwinkle-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-jet-black-900 truncate">{user?.name}</p>
                  {isInTrial() && (
                    <p className="text-xs text-periwinkle-600">
                      Trial: {getTrialDaysRemaining()} dias
                    </p>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-jet-black-500 transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className={`absolute bottom-full ${collapsed ? 'left-0 min-w-48' : 'left-0 right-0'} mb-2 bg-white rounded-lg shadow-lg border py-1 z-50`}>
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
        <SidebarContent collapsed={false} />
      </aside>

      {/* Sidebar - Desktop (fixed) */}
      <aside
        ref={sidebarRef}
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-jet-black-200 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Main content area */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
        {/* Desktop header with notifications */}
        <header className="hidden lg:flex items-center justify-end h-14 px-6 bg-white border-b border-jet-black-100 sticky top-0 z-30">
          <NotificationBell />
        </header>

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

            <NotificationBell />
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
