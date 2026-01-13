import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, ArrowRight, Zap } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

const PLAN_NAMES = {
  basic: 'Básico',
  pro: 'Pro',
  enterprise: 'Enterprise'
}

/**
 * HOC para proteger features premium
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a ser protegido
 * @param {Array<string>} props.requiredPlans - Planos necessários (ex: ['pro', 'enterprise'])
 * @param {string} props.featureName - Nome da feature (para exibir na mensagem)
 * @param {string} props.fallback - Componente customizado de fallback (opcional)
 *
 * @example
 * <SubscriptionGuard requiredPlans={['pro', 'enterprise']} featureName="Relatórios Avançados">
 *   <AdvancedReports />
 * </SubscriptionGuard>
 */
export default function SubscriptionGuard({
  children,
  requiredPlans = [],
  featureName = 'este recurso',
  fallback = null
}) {
  const navigate = useNavigate()
  const { subscription, loading, hasActiveSubscription, canAccessFeature } = useSubscription()

  // Enquanto carrega, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  // Se não tem assinatura ativa
  if (!hasActiveSubscription()) {
    if (fallback) {
      return fallback
    }

    return (
      <div className="bg-gradient-to-br from-periwinkle-50 to-space-indigo-50 rounded-xl shadow-lg p-8 border border-periwinkle-100">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-periwinkle-500 to-space-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-jet-black-900 mb-2">
            Recurso Premium
          </h3>

          {/* Description */}
          <p className="text-jet-black-600 mb-6">
            Para acessar <span className="font-semibold">{featureName}</span>,
            você precisa ter uma assinatura ativa do AgendaMais.
          </p>

          {/* Features */}
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-medium text-jet-black-900 mb-3">
              Com uma assinatura você tem acesso a:
            </p>
            <ul className="space-y-2 text-sm text-jet-black-700">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-periwinkle-600" />
                <span>Agendamentos ilimitados</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-periwinkle-600" />
                <span>Lembretes automáticos</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-periwinkle-600" />
                <span>Relatórios avançados</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-periwinkle-600" />
                <span>Suporte prioritário</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/subscription/plans')}
            className="w-full bg-gradient-to-r from-periwinkle-500 to-space-indigo-600 hover:from-periwinkle-600 hover:to-space-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Ver Planos e Preços
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-jet-black-500 mt-4">
            3 dias de teste gratuito • Cancele quando quiser
          </p>
        </div>
      </div>
    )
  }

  // Se tem assinatura mas não tem o plano necessário
  if (requiredPlans.length > 0 && !canAccessFeature(requiredPlans)) {
    if (fallback) {
      return fallback
    }

    const currentPlanName = PLAN_NAMES[subscription?.plan] || 'Atual'
    const requiredPlanNames = requiredPlans.map(p => PLAN_NAMES[p] || p).join(' ou ')

    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border border-yellow-100">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-jet-black-900 mb-2">
            Upgrade Necessário
          </h3>

          {/* Description */}
          <p className="text-jet-black-600 mb-6">
            O recurso <span className="font-semibold">{featureName}</span> está
            disponível apenas para os planos{' '}
            <span className="font-semibold">{requiredPlanNames}</span>.
          </p>

          {/* Current Plan */}
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-jet-black-600">Seu plano atual:</span>
              <span className="font-semibold text-jet-black-900">{currentPlanName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-jet-black-600">Upgrade necessário:</span>
              <span className="font-semibold text-orange-600">{requiredPlanNames}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/subscription/plans')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Fazer Upgrade
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-jet-black-500 mt-4">
            Upgrade instantâneo • Pague apenas a diferença
          </p>
        </div>
      </div>
    )
  }

  // Se tem acesso, renderizar o componente
  return children
}

/**
 * Hook alternativo para verificar acesso programaticamente
 */
export function useFeatureAccess(requiredPlans = []) {
  const { hasActiveSubscription, canAccessFeature, subscription } = useSubscription()

  return {
    hasAccess: canAccessFeature(requiredPlans),
    hasSubscription: hasActiveSubscription(),
    currentPlan: subscription?.plan,
    needsUpgrade: hasActiveSubscription() && !canAccessFeature(requiredPlans)
  }
}
