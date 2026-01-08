import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useOnboarding } from './contexts/OnboardingContext'
import { useSubscription } from './contexts/SubscriptionContext'
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
// Páginas públicas de agendamento online
import LandingPage from './pages/public/LandingPage'
import BookingPage from './pages/public/BookingPage'
import BookingConfirmation from './pages/public/BookingConfirmation'
import BookingLookup from './pages/public/BookingLookup'
import BookingCancel from './pages/public/BookingCancel'
import TermsOfService from './pages/public/TermsOfService'
import PrivacyPolicy from './pages/public/PrivacyPolicy'
import LGPD from './pages/public/LGPD'

function App() {
  const { isAuthenticated, loading } = useAuth()
  const { showOnboarding, loading: onboardingLoading } = useOnboarding()
  const { hasActiveSubscription, loading: subscriptionLoading } = useSubscription()
  const location = useLocation()

  // Verificar se é uma rota pública de agendamento
  // Verifica tanto o pathname do router quanto a URL real (para redirect de /agendar para /#/agendar)
  const isPublicBookingRoute = location.pathname.startsWith('/agendar')
  const isLandingPage = location.pathname === '/' || location.pathname === ''

  // Se acessou /agendar sem hash, redireciona para /#/agendar
  if (window.location.pathname.startsWith('/agendar') && !window.location.hash) {
    window.location.replace('/#' + window.location.pathname + window.location.search)
    return null
  }

  // Rotas públicas não precisam de loading de autenticação
  if (isPublicBookingRoute) {
    return (
      <Routes>
        <Route path="/agendar/:slug" element={<BookingPage />} />
        <Route path="/agendar/:slug/confirmacao/:code" element={<BookingConfirmation />} />
        <Route path="/agendar/:slug/consultar" element={<BookingLookup />} />
        <Route path="/agendar/:slug/cancelar/:code" element={<BookingCancel />} />
      </Routes>
    )
  }

  // Landing page - sempre acessível na rota raiz (página principal do site)
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    )
  }

  if (loading || onboardingLoading || (isAuthenticated && subscriptionLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
  if (!hasActiveSubscription()) {
    return (
      <Routes>
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
      <Route 
        path="/login" 
        element={<Navigate to="/" replace />} 
      />
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