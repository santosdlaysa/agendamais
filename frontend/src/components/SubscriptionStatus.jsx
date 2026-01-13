import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronRight
} from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

const PLAN_NAMES = {
  basic: { name: 'Básico', price: 29, color: 'gray' },
  pro: { name: 'Pro', price: 59, color: 'blue' },
  enterprise: { name: 'Enterprise', price: 99, color: 'purple' }
}

const STATUS_CONFIG = {
  active: {
    label: 'Ativa',
    color: 'green',
    icon: CheckCircle,
    description: 'Sua assinatura está ativa e em dia'
  },
  trialing: {
    label: 'Teste Gratuito',
    color: 'blue',
    icon: Clock,
    description: 'Você está no período de teste gratuito'
  },
  past_due: {
    label: 'Pagamento Pendente',
    color: 'red',
    icon: AlertCircle,
    description: 'Há um problema com seu pagamento'
  },
  canceled: {
    label: 'Cancelada',
    color: 'gray',
    icon: XCircle,
    description: 'Sua assinatura foi cancelada'
  }
}

export default function SubscriptionStatus() {
  const navigate = useNavigate()
  const {
    subscription,
    loading,
    refreshing,
    cancelSubscription,
    reactivateSubscription,
    openBillingPortal,
    hasPaymentMethod,
    getTrialDaysRemaining,
    isCanceledButActive,
    refreshSubscription
  } = useSubscription()

  const [cancelLoading, setCancelLoading] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Atualizar dados ao carregar a página (importante quando volta do Stripe)
  useEffect(() => {
    refreshSubscription()
  }, [])

  // Só mostra spinner de carregamento na carga inicial
  if (loading && !subscription) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-periwinkle-600" />
          <span className="ml-2 text-jet-black-600">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 mb-1">
              Nenhuma assinatura ativa
            </h3>
            <p className="text-yellow-800 mb-4">
              Assine um plano para acessar todos os recursos do AgendaMais
            </p>
            <button
              onClick={() => navigate('/subscription/plans')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Ver Planos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[subscription.status] || STATUS_CONFIG.active
  const planInfo = PLAN_NAMES[subscription.plan] || {}
  const StatusIcon = statusConfig.icon
  const trialDays = getTrialDaysRemaining()

  const handleCancel = async () => {
    setCancelLoading(true)
    const result = await cancelSubscription()
    setCancelLoading(false)
    setShowCancelModal(false)
  }

  const handleReactivate = async () => {
    setCancelLoading(true)
    await reactivateSubscription()
    setCancelLoading(false)
  }

  const handleOpenBilling = async () => {
    setBillingLoading(true)
    await openBillingPortal()
    setBillingLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-jet-black-900">Minha Assinatura</h2>
            {refreshing && <Loader2 className="w-5 h-5 animate-spin text-periwinkle-600" />}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
          >
            <StatusIcon className="w-4 h-4" />
            {statusConfig.label}
          </span>
        </div>

        {/* Status Description */}
        <p className="text-jet-black-600 mb-6">{statusConfig.description}</p>

        {/* Subscription Details */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Plan */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-periwinkle-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-periwinkle-600" />
            </div>
            <div>
              <p className="text-sm text-jet-black-600 mb-1">Plano Atual</p>
              <p className="font-semibold text-jet-black-900">{planInfo.name}</p>
              <p className="text-sm text-jet-black-500">R$ {planInfo.price}/mês</p>
            </div>
          </div>

          {/* Date Info */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              {subscription.status === 'trialing' && subscription.trial_end ? (
                <>
                  <p className="text-sm text-jet-black-600 mb-1">Término do Teste</p>
                  <p className="font-semibold text-jet-black-900">
                    {new Date(subscription.trial_end).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-jet-black-500">{trialDays} dias restantes</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-jet-black-600 mb-1">Data de Início</p>
                  <p className="font-semibold text-jet-black-900">
                    {new Date(subscription.start_date).toLocaleDateString('pt-BR')}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Trial Warning */}
        {subscription.status === 'trialing' && trialDays <= 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">
                  Seu trial está terminando
                </p>
                <p className="text-sm text-yellow-800">
                  Seu período de teste gratuito termina em {trialDays} dias. Após isso,
                  você será cobrado R$ {planInfo.price}/mês.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Warning - Trial sem cartão */}
        {subscription.status === 'trialing' && !hasPaymentMethod() && (
          <div className="bg-periwinkle-50 border border-periwinkle-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-periwinkle-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-periwinkle-900 mb-1">
                  Cadastre seu cartão
                </p>
                <p className="text-sm text-periwinkle-800 mb-3">
                  Você está no período de teste gratuito. Cadastre seu cartão para continuar
                  usando o sistema após o término do trial.
                </p>
                <button
                  onClick={handleOpenBilling}
                  disabled={billingLoading}
                  className="bg-periwinkle-600 hover:bg-periwinkle-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {billingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Abrindo...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Cadastrar Cartão
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Warning */}
        {isCanceledButActive() && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Assinatura será cancelada
                </p>
                <p className="text-sm text-red-800 mb-3">
                  Sua assinatura continuará ativa até o fim do período pago.
                  Mudou de ideia?
                </p>
                <button
                  onClick={handleReactivate}
                  disabled={cancelLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {cancelLoading ? 'Reativando...' : 'Reativar Assinatura'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Pending */}
        {subscription.status === 'past_due' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">
                  Problema com o pagamento
                </p>
                <p className="text-sm text-red-800 mb-3">
                  Não conseguimos processar seu último pagamento. Por favor,
                  atualize seus dados de pagamento.
                </p>
                <button
                  onClick={handleOpenBilling}
                  disabled={billingLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {billingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Abrindo...
                    </>
                  ) : (
                    'Atualizar Forma de Pagamento'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {subscription.status !== 'canceled' && !isCanceledButActive() && (
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button
              onClick={() => navigate('/subscription/plans')}
              className="flex-1 bg-periwinkle-500 hover:bg-periwinkle-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Alterar Plano
            </button>
            <button
              onClick={handleOpenBilling}
              disabled={billingLoading}
              className="flex-1 bg-jet-black-100 hover:bg-jet-black-200 text-jet-black-800 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {billingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Abrindo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Gerenciar Pagamento
                </>
              )}
            </button>
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex-1 bg-jet-black-100 hover:bg-jet-black-200 text-jet-black-800 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancelar Assinatura
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-jet-black-900 mb-4">
              Cancelar Assinatura
            </h3>
            <p className="text-jet-black-600 mb-6">
              Tem certeza que deseja cancelar sua assinatura? Você manterá acesso
              até o fim do período pago.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
                className="flex-1 bg-jet-black-100 hover:bg-jet-black-200 text-jet-black-800 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Não, manter
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  'Sim, cancelar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
