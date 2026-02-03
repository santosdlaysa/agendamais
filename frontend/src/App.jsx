import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useOnboarding } from './contexts/OnboardingContext'
import { useSubscription } from './contexts/SubscriptionContext'
import { useProfessionalAuth } from './contexts/ProfessionalAuthContext'
import { useSuperAdmin } from './contexts/SuperAdminContext'
import Login from './components/Login'
import OnboardingWizard from './components/OnboardingWizard'
import Dashboard from './components/Dashboard'
import Layout from './components/Layout'
import Services from './components/Services'
import ServiceForm from './components/ServiceForm'
import Professionals from './components/Professionals'
import ProfessionalForm from './components/ProfessionalForm'
import Clients from './components/Clients'
import ClientForm from './components/ClientForm'
import Appointments from './components/Appointments'
import AppointmentForm from './components/AppointmentForm'
import AppointmentView from './components/AppointmentView'
import FinancialReport from './components/FinancialReport'
import Reminders from './components/Reminders'
import ReminderSettings from './components/ReminderSettings'
// ApiDebug removido para produção
import SubscriptionPlans from './components/SubscriptionPlans'
import PaymentModal from './components/PaymentModal'
import SubscriptionStatus from './components/SubscriptionStatus'
import SubscriptionSuccess from './components/SubscriptionSuccess'
import SubscriptionCanceled from './components/SubscriptionCanceled'
import Settings from './components/Settings'
import NotificationsPage from './pages/NotificationsPage'
// Páginas públicas de agendamento online
import LandingPage from './pages/public/LandingPage'
import BookingPage from './pages/public/BookingPage'
import BookingConfirmation from './pages/public/BookingConfirmation'
import BookingLookup from './pages/public/BookingLookup'
import BookingCancel from './pages/public/BookingCancel'
import BookingPaymentSuccess from './pages/public/BookingPaymentSuccess'
import BookingPaymentCanceled from './pages/public/BookingPaymentCanceled'
import TermsOfService from './pages/public/TermsOfService'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import LGPD from './pages/public/LGPD'
// Páginas do portal do profissional
import {
  ProfessionalLogin,
  ProfessionalActivate,
  ProfessionalLayout,
  ProfessionalDashboard,
  ProfessionalSchedule,
  ProfessionalClients,
  ProfessionalSettings
} from './pages/professional'
import ProfessionalForgotPassword from './pages/professional/ProfessionalForgotPassword'
// Páginas do Super Admin
import {
  SuperAdminLayout,
  SuperAdminDashboard,
  SuperAdminCompanies,
  SuperAdminCompanyDetail,
  SuperAdminSubscriptions,
  SuperAdminAnalytics,
  SuperAdminPayments
} from './pages/superadmin'
import AdminPayments from './components/AdminPayments'

function App() {
  const { isAuthenticated, loading, user } = useAuth()
  const { showOnboarding, loading: onboardingLoading } = useOnboarding()
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription()
  const { isAuthenticated: isProfessionalAuthenticated, loading: professionalLoading } = useProfessionalAuth()
  const { isAuthenticated: isSuperAdminAuthenticated, loading: superAdminLoading } = useSuperAdmin()
  const location = useLocation()

  // Redirecionar URLs antigas com hash (ex: /#/agendar/edbarbearia -> /agendar/edbarbearia)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const hashPath = window.location.hash.slice(1) // Remove o '#'
    window.location.replace(hashPath + window.location.search)
    return null
  }

  // Verificar se é uma rota do Super Admin
  const isSuperAdminRoute = location.pathname.startsWith('/superadmin')

  // Verificar se é uma rota pública de agendamento
  const isPublicBookingRoute = location.pathname.startsWith('/agendar')
  const isLandingPage = location.pathname === '/' || location.pathname === ''
  const isProfessionalRoute = location.pathname.startsWith('/profissional')
  const isLegalPage = location.pathname === '/termos' ||
                      location.pathname === '/privacidade' ||
                      location.pathname === '/lgpd'

  // Rotas do Super Admin
  if (isSuperAdminRoute) {
    if (superAdminLoading || loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
        </div>
      )
    }

    // Se não está autenticado, redireciona para login principal
    if (!isAuthenticated) {
      return (
        <Routes>
          <Route path="/superadmin/*" element={<Navigate to="/login" replace />} />
        </Routes>
      )
    }

    // Se está autenticado mas não é admin, redireciona para dashboard normal
    if (!isSuperAdminAuthenticated) {
      return (
        <Routes>
          <Route path="/superadmin/*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )
    }

    // Rotas protegidas do Super Admin (apenas para admins)
    return (
      <Routes>
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="companies" element={<SuperAdminCompanies />} />
          <Route path="companies/:id" element={<SuperAdminCompanyDetail />} />
          <Route path="subscriptions" element={<SuperAdminSubscriptions />} />
          <Route path="analytics" element={<SuperAdminAnalytics />} />
          <Route path="payments" element={<SuperAdminPayments />} />
        </Route>

        <Route path="/superadmin/*" element={<Navigate to="/superadmin/dashboard" replace />} />
      </Routes>
    )
  }

  // Rotas do portal do profissional
  if (isProfessionalRoute) {
    // Rotas públicas do profissional (login, ativar, esqueci senha)
    const isProfessionalPublicRoute =
      location.pathname === '/profissional/login' ||
      location.pathname.startsWith('/profissional/ativar') ||
      location.pathname === '/profissional/esqueci-senha'

    if (professionalLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      )
    }

    // Se não está autenticado e não é rota pública, redireciona para login
    if (!isProfessionalAuthenticated && !isProfessionalPublicRoute) {
      return (
        <Routes>
          <Route path="/profissional/*" element={<Navigate to="/profissional/login" replace />} />
        </Routes>
      )
    }

    // Rotas do profissional
    return (
      <Routes>
        {/* Rotas públicas do profissional */}
        <Route path="/profissional/login" element={<ProfessionalLogin />} />
        <Route path="/profissional/ativar/:token" element={<ProfessionalActivate />} />
        <Route path="/profissional/esqueci-senha" element={<ProfessionalForgotPassword />} />

        {/* Rotas protegidas do profissional */}
        <Route path="/profissional" element={<ProfessionalLayout />}>
          <Route index element={<Navigate to="/profissional/dashboard" replace />} />
          <Route path="dashboard" element={<ProfessionalDashboard />} />
          <Route path="agenda" element={<ProfessionalSchedule />} />
          <Route path="clientes" element={<ProfessionalClients />} />
          <Route path="configuracoes" element={<ProfessionalSettings />} />
        </Route>

        <Route path="/profissional/*" element={<Navigate to="/profissional/dashboard" replace />} />
      </Routes>
    )
  }

  // Rotas públicas não precisam de loading de autenticação
  if (isPublicBookingRoute) {
    return (
      <Routes>
        <Route path="/agendar/:slug" element={<BookingPage />} />
        <Route path="/agendar/:slug/confirmacao" element={<BookingConfirmation />} />
        <Route path="/agendar/:slug/confirmacao/:code" element={<BookingConfirmation />} />
        <Route path="/agendar/:slug/consultar" element={<BookingLookup />} />
        <Route path="/agendar/:slug/cancelar/:code" element={<BookingCancel />} />
        <Route path="/agendar/:slug/pagamento/sucesso" element={<BookingPaymentSuccess />} />
        <Route path="/agendar/:slug/pagamento/cancelado" element={<BookingPaymentCanceled />} />
      </Routes>
    )
  }

  // Landing page - se estiver logado, redireciona para o dashboard
  if (isLandingPage) {
    if (isAuthenticated) {
      return (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )
    }
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    )
  }

  // Páginas legais - sempre acessíveis publicamente
  if (isLegalPage) {
    return (
      <Routes>
        <Route path="/termos" element={<TermsOfService />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/lgpd" element={<LGPD />} />
      </Routes>
    )
  }

  if (loading || onboardingLoading || (isAuthenticated && subscriptionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  // Verificação de autenticação - redireciona para landing page se não autenticado
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/termos" element={<TermsOfService />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/lgpd" element={<LGPD />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Usuário autenticado mas sem assinatura - deve escolher um plano primeiro
  // Admins não precisam de assinatura
  const isAdmin = user?.role === 'admin'
  if (!hasActiveSubscription() && !isAdmin) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/subscription/plans" element={<SubscriptionPlans />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
        <Route path="*" element={<Navigate to="/subscription/plans" replace />} />
      </Routes>
    )
  }

  // Mostrar onboarding para novos usuários (após ter assinatura)
  if (showOnboarding) {
    return <OnboardingWizard />
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Login />} />
      <Route
        path="/*" 
        element={
          <Layout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              <Route path="clients" element={<Clients />} />
              <Route path="clients/new" element={<ClientForm />} />
              <Route path="clients/:id/edit" element={<ClientForm />} />
              
              <Route path="professionals" element={<Professionals />} />
              <Route path="professionals/new" element={<ProfessionalForm />} />
              <Route path="professionals/:id/edit" element={<ProfessionalForm />} />
              
              <Route path="services" element={<Services />} />
              <Route path="services/new" element={<ServiceForm />} />
              <Route path="services/:id/edit" element={<ServiceForm />} />
              
              <Route path="appointments" element={<Appointments />} />
              <Route path="appointments/new" element={<AppointmentForm />} />
              <Route path="appointments/:id" element={<AppointmentView />} />
              <Route path="appointments/:id/edit" element={<AppointmentForm />} />
              
              <Route path="reports" element={<FinancialReport />} />

              <Route path="reminders" element={<Reminders />} />
              <Route path="reminders/settings" element={<ReminderSettings />} />

              <Route path="subscription/plans" element={<SubscriptionPlans />} />
              <Route path="subscription/payment" element={<PaymentModal />} />
              <Route path="subscription/manage" element={<SubscriptionStatus />} />
              <Route path="subscription/success" element={<SubscriptionSuccess />} />
              <Route path="subscription/canceled" element={<SubscriptionCanceled />} />

              <Route path="settings" element={<Settings />} />

              <Route path="admin/payments" element={<AdminPayments />} />

              <Route path="notifications" element={<NotificationsPage />} />

              <Route path="termos" element={<TermsOfService />} />
              <Route path="privacidade" element={<PrivacyPolicy />} />
              <Route path="lgpd" element={<LGPD />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } 
      />
    </Routes>
  )
}

export default App