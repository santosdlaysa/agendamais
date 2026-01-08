import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const SubscriptionContext = createContext()

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState([])

  // Buscar status da assinatura ao carregar (apenas se autenticado)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchSubscriptionStatus()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const response = await api.get('/subscriptions/status')

      console.log('Subscription Status Response:', response.data)

      if (response.data.has_subscription) {
        setSubscription(response.data.subscription)
      } else {
        setSubscription(null)
      }
    } catch (error) {
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
      toast.error('Erro ao carregar planos')
      return []
    }
  }

  const createSubscription = async (planId) => {
    try {
      // Construir URLs de sucesso e cancelamento
      const baseUrl = window.location.origin
      // Incluir {CHECKOUT_SESSION_ID} para o Stripe substituir pelo ID da sessão
      const successUrl = `${baseUrl}/#/subscription/success?session_id={CHECKOUT_SESSION_ID}`
      const cancelUrl = `${baseUrl}/#/subscription/canceled`

      console.log('Creating subscription with URLs:', { baseUrl, successUrl, cancelUrl })

      const response = await api.post('/subscriptions/subscribe', {
        plan: planId,
        success_url: successUrl,
        cancel_url: cancelUrl
      })

      console.log('Subscription response:', response.data)

      // Retornar checkout_url para redirecionamento externo
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

  // Verificar checkout do Stripe e ativar assinatura
  const verifyCheckout = async (sessionId) => {
    try {
      const response = await api.post('/subscriptions/verify-checkout', {
        session_id: sessionId
      })

      if (response.data.success) {
        // Atualizar estado local com a assinatura ativada
        await fetchSubscriptionStatus()
        return { success: true, subscription: response.data.subscription }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Erro ao verificar pagamento'
      return { success: false, error: message }
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

  // Abrir portal de billing do Stripe para gerenciar cartão
  const openBillingPortal = async () => {
    try {
      const baseUrl = window.location.origin
      const returnUrl = `${baseUrl}/#/subscription/manage`

      const response = await api.post('/subscriptions/billing-portal', {
        return_url: returnUrl
      })

      if (response.data.url) {
        window.location.href = response.data.url
        return { success: true }
      }
    } catch (error) {
      console.error('Billing Portal Error:', error.response?.data || error.message)
      const message = error.response?.data?.error || 'Erro ao abrir portal de pagamento'
      toast.error(message)
      return {
        success: false,
        error: message
      }
    }
  }

  // Verificar se tem cartão cadastrado
  const hasPaymentMethod = () => {
    return subscription?.has_payment_method === true
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
    hasPaymentMethod,
    isCanceledButActive,
    getTrialDaysRemaining,
    fetchSubscriptionStatus,
    fetchPlans,
    createSubscription,
    verifyCheckout,
    cancelSubscription,
    reactivateSubscription,
    openBillingPortal,
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
