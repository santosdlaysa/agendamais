import { useState, useRef, useEffect } from 'react'
import { useSuperAdmin } from '../../contexts/SuperAdminContext'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import {
  Shield,
  LogOut,
  Building2,
  CreditCard,
  BarChart3,
  LayoutDashboard,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeft,
  AlertTriangle,
  Settings
} from 'lucide-react'

export default function SuperAdminLayout() {
  const { superAdmin, logout } = useSuperAdmin()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('superadminSidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)
  const sidebarRef = useRef(null)

  // Persistir estado da sidebar
  useEffect(() => {
    localStorage.setItem('superadminSidebarCollapsed', JSON.stringify(sidebarCollapsed))
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

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
  }

  const navLinkClass = ({ isActive }, collapsed = false) =>
    `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-violet-100 text-violet-700'
        : 'text-jet-black-600 hover:bg-jet-black-100 hover:text-jet-black-900'
    }`

  const getNavLinkClass = (collapsed) => ({ isActive }) => navLinkClass({ isActive }, collapsed)

  const SidebarContent = ({ collapsed = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex ${collapsed ? 'flex-col items-center justify-center py-3 gap-2' : 'flex-row items-center justify-between h-16 px-4'} border-b border-jet-black-200`}>
        <div className="flex items-center min-w-0">
          <Shield className="h-8 w-8 text-violet-600 flex-shrink-0" />
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-bold text-jet-black-900">AgendaMais</h1>
              <span className="text-xs text-violet-600 font-medium">Super Admin</span>
            </div>
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
        {/* Principal */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Principal
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/superadmin/dashboard" className={getNavLinkClass(collapsed)} title="Dashboard">
              <LayoutDashboard className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Dashboard'}
            </NavLink>
            <NavLink to="/superadmin/companies" className={getNavLinkClass(collapsed)} title="Empresas">
              <Building2 className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Empresas'}
            </NavLink>
          </div>
        </div>

        {/* Financeiro */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Financeiro
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/superadmin/subscriptions" className={getNavLinkClass(collapsed)} title="Assinaturas">
              <CreditCard className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Assinaturas'}
            </NavLink>
            <NavLink to="/superadmin/analytics" className={getNavLinkClass(collapsed)} title="Analytics">
              <BarChart3 className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Analytics'}
            </NavLink>
          </div>
        </div>

        {/* Sistema */}
        <div>
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-jet-black-400 uppercase tracking-wider">
              Sistema
            </p>
          )}
          <div className="space-y-1">
            <NavLink to="/superadmin/alerts" className={getNavLinkClass(collapsed)} title="Alertas">
              <AlertTriangle className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Alertas'}
            </NavLink>
            <NavLink to="/superadmin/settings" className={getNavLinkClass(collapsed)} title="Configuracoes">
              <Settings className={`h-5 w-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && 'Configuracoes'}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-jet-black-200 p-3">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-2' : 'px-3'} py-2.5 rounded-lg hover:bg-jet-black-100 transition-colors`}
            title={collapsed ? superAdmin?.name : undefined}
          >
            <div className="w-9 h-9 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {superAdmin?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-jet-black-900 truncate">{superAdmin?.name}</p>
                  <p className="text-xs text-violet-600">Super Admin</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-jet-black-500 transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className={`absolute bottom-full ${collapsed ? 'left-0 min-w-48' : 'left-0 right-0'} mb-2 bg-white rounded-lg shadow-lg border py-1 z-50`}>
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-jet-black-900">{superAdmin?.name}</p>
                <p className="text-xs text-jet-black-500 truncate">{superAdmin?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">
                  Super Admin
                </span>
              </div>
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

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent collapsed={false} />
      </aside>

      {/* Sidebar - Desktop */}
      <aside
        ref={sidebarRef}
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-jet-black-200 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
        }`}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
      </aside>

      {/* Main content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
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
              <Shield className="h-7 w-7 text-violet-600" />
              <div className="ml-2">
                <span className="text-lg font-bold text-jet-black-900">AgendaMais</span>
                <span className="block text-xs text-violet-600">Super Admin</span>
              </div>
            </div>

            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
