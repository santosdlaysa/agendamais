import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
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

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Verificação de autenticação - login obrigatório
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        } 
      />
    </Routes>
  )
}

export default App