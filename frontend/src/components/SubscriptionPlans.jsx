import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Loader2, ArrowLeft } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'
import toast from 'react-hot-toast'
import api from '../utils/api'

const PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29,
    popular: false,
    features: [
      'Até 100 agendamentos/mês',
      'Até 3 profissionais',
      'Lembretes por WhatsApp',
      'Suporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    popular: true,
    features: [
      'Agendamentos ilimitados',
      'Até 10 profissionais',
      'Lembretes WhatsApp/SMS',
      'Relatórios avançados',
      'Suporte prioritário'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    popular: false,
    features: [
      'Tudo do Pro',
      'Profissionais ilimitados',
      'API personalizada',
      'Gestor de conta dedicado',
      'Suporte 24/7'
    ]
  }
]

export default function SubscriptionPlans() {
  const navigate = useNavigate()
  const { createSubscription, hasActiveSubscription, subscription, refreshSubscription } = useSubscription()
  const [loading, setLoading] = useState(null)

  // Só considera como plano atual se tiver uma assinatura ativa
  const currentPlan = hasActiveSubscription() ? subscription?.plan : null

  // Verifica se tem uma assinatura pendente (iniciou checkout mas não completou)
  const hasPendingSubscription = subscription?.status === 'pending'
  const pendingPlan = hasPendingSubscription ? subscription?.plan : null

  const handleSelectPlan = async (planId) => {
    // Se é o plano atual ativo, não faz nada
    if (planId === currentPlan) {
      return
    }

    setLoading(planId)

    try {
      if (hasActiveSubscription()) {
        // Alterar plano existente
        const response = await api.post('/subscriptions/change-plan', {
          plan: planId
        })

        if (response.data.message) {
          toast.success(response.data.message)
          await refreshSubscription()
          navigate('/subscription/manage')
        }
      } else {
        // Criar nova assinatura ou retentar checkout pendente
        const result = await createSubscription(planId)

        if (result.success && result.data.checkout_url) {
          window.location.href = result.data.checkout_url
        }
      }
    } catch (error) {
      console.error('Change Plan Error:', error.response?.data || error.message)
      const message = error.response?.data?.error || 'Erro ao processar solicitação'
      toast.error(message)
    } finally {
      setLoading(null)
    }
  }

  const getButtonText = (planId) => {
    if (loading === planId) {
      return (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Processando...
        </>
      )
    }

    if (planId === currentPlan) {
      return 'Plano Atual'
    }

    if (hasActiveSubscription()) {
      const currentIndex = PLANS.findIndex(p => p.id === currentPlan)
      const newIndex = PLANS.findIndex(p => p.id === planId)
      return newIndex > currentIndex ? 'Fazer Upgrade' : 'Fazer Downgrade'
    }

    return 'Começar Teste Gratuito'
  }

  return (
    <div className="min-h-screen bg-jet-black-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {hasActiveSubscription() && (
            <button
              onClick={() => navigate('/subscription/manage')}
              className="inline-flex items-center gap-2 text-jet-black-600 hover:text-jet-black-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Minha Assinatura
            </button>
          )}
          <h1 className="text-4xl font-bold text-jet-black-900 mb-4">
            {hasActiveSubscription() ? 'Alterar Plano' : 'Escolha seu Plano'}
          </h1>
          <p className="text-xl text-jet-black-600">
            {hasActiveSubscription()
              ? 'Selecione o plano que melhor atende suas necessidades'
              : '3 dias grátis nos planos Pro e Enterprise'
            }
          </p>
          {!hasActiveSubscription() && (
            <p className="text-sm text-jet-black-500 mt-2">
              Sem compromisso. Cancele a qualquer momento.
            </p>
          )}

          {/* Aviso de assinatura pendente */}
          {hasPendingSubscription && (
            <div className="mt-6 max-w-xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Você tem uma assinatura pendente do plano {pendingPlan?.toUpperCase()}.
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Clique no plano desejado para completar o pagamento e ativar sua conta.
              </p>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-periwinkle-500 transform scale-105' : ''
              } ${plan.id === currentPlan ? 'ring-2 ring-green-500' : ''}`}
            >
              {/* Current Plan Badge */}
              {plan.id === currentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Plano Atual
                  </span>
                </div>
              )}

              {/* Popular Badge */}
              {plan.popular && plan.id !== currentPlan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-periwinkle-500 to-periwinkle-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-jet-black-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-jet-black-900">
                    R$ {plan.price}
                  </span>
                  <span className="text-jet-black-600 text-lg">/mês</span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  {plan.id === 'basic' ? 'Comece agora' : '3 dias grátis'}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-jet-black-700 text-sm leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id || plan.id === currentPlan}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.id === currentPlan
                    ? 'bg-green-100 text-green-800 cursor-default'
                    : plan.popular
                    ? 'bg-gradient-to-r from-periwinkle-500 to-periwinkle-600 hover:from-periwinkle-600 hover:to-periwinkle-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-jet-black-100 hover:bg-jet-black-200 text-jet-black-900'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {getButtonText(plan.id)}
              </button>

              <p className="text-center text-xs text-jet-black-500 mt-4">
                {plan.id === currentPlan ? 'Você está neste plano' : 'Cancele a qualquer momento'}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-jet-black-600 mb-4">
            Todas as assinaturas incluem:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-jet-black-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Suporte técnico</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Atualizações automáticas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Segurança SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Backup diário</span>
            </div>
          </div>
        </div>

        {/* FAQ or Questions */}
        <div className="mt-12 text-center">
          <p className="text-jet-black-600">
            Dúvidas sobre os planos?{' '}
            <a
              href="mailto:suporte@agendamais.site"
              className="text-periwinkle-600 hover:text-periwinkle-700 font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
