import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const SubscriptionContext = createContext()

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState([])

  // Buscar status da assinatura ao carregar
  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const response = await api.get('/subscriptions/status')

      if (response.data.has_subscription) {
        setSubscription(response.data.subscription)
      } else {
        setSubscription(null)
      }
    } catch (error) {
      console.error('Erro ao buscar status da assinatura:', error)
      // Não mostrar erro se for 401 (não autenticado)
      if (error.response?.status !== 401) {
        toast.error('Erro ao carregar status da assinatura')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await api.get('/subscriptions/plans')
      setPlans(response.data.plans)
      return response.data.plans
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      toast.error('Erro ao carregar planos')
      return []
    }
  }

  const createSubscription = async (planId) => {
    try {
      const response = await api.post('/subscriptions/subscribe', {
        plan: planId
      })

      // Atualizar estado local
      await fetchSubscriptionStatus()

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar assinatura'
      toast.error(message)
      return {
        success: false,
        error: message
      }
    }
  }

  const cancelSubscription = async () => {
    try {
      const response = await api.post('/subscriptions/cancel')

      // Atualizar estado local
      await fetchSubscriptionStatus()

      toast.success(response.data.message)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao cancelar assinatura'
      toast.error(message)
      return {
        success: false,
        error: message
      }
    }
  }

  const reactivateSubscription = async () => {
    try {
      const response = await api.post('/subscriptions/reactivate')

      // Atualizar estado local
      await fetchSubscriptionStatus()

      toast.success(response.data.message)
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao reativar assinatura'
      toast.error(message)
      return {
        success: false,
        error: message
      }
    }
  }

  // Verificar se tem assinatura ativa
  const hasActiveSubscription = () => {
    return subscription && ['active', 'trialing'].includes(subscription.status)
  }

  // Verificar se pode acessar uma feature específica
  const canAccessFeature = (requiredPlans = []) => {
    if (!hasActiveSubscription()) return false
    if (requiredPlans.length === 0) return true
    return requiredPlans.includes(subscription?.plan)
  }

  // Verificar se está em trial
  const isInTrial = () => {
    return subscription?.status === 'trialing'
  }

  // Verificar se tem pagamento pendente
  const hasPaymentPending = () => {
    return subscription?.status === 'past_due'
  }

  // Verificar se está cancelada mas ainda ativa
  const isCanceledButActive = () => {
    return subscription?.cancel_at_period_end === true &&
           ['active', 'trialing'].includes(subscription?.status)
  }

  // Obter dias restantes do trial
  const getTrialDaysRemaining = () => {
    if (!subscription?.trial_end) return 0

    const now = new Date()
    const trialEnd = new Date(subscription.trial_end)
    const diffTime = trialEnd - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  const value = {
    subscription,
    loading,
    plans,
    hasActiveSubscription,
    canAccessFeature,
    isInTrial,
    hasPaymentPending,
    isCanceledButActive,
    getTrialDaysRemaining,
    fetchSubscriptionStatus,
    fetchPlans,
    createSubscription,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription: fetchSubscriptionStatus
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription deve ser usado dentro de um SubscriptionProvider')
  }
  return context
}
