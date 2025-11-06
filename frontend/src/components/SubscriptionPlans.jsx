import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Loader2 } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

const PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29,
    popular: false,
    features: [
      'Até 100 agendamentos/mês',
      'Até 3 profissionais',
      'Lembretes básicos',
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
  const { createSubscription, hasActiveSubscription } = useSubscription()
  const [loading, setLoading] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)

  useEffect(() => {
    // Se já tem assinatura ativa, redirecionar para gerenciamento
    if (hasActiveSubscription()) {
      navigate('/subscription/manage')
    }
  }, [hasActiveSubscription, navigate])

  const handleSelectPlan = async (planId) => {
    setSelectedPlan(planId)
    setLoading(planId)

    try {
      const result = await createSubscription(planId)

      if (result.success) {
        // Redirecionar para página de pagamento
        navigate('/subscription/payment', {
          state: {
            clientSecret: result.data.client_secret,
            subscriptionId: result.data.subscription_id,
            planId: planId
          }
        })
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600">
            Teste gratuito de 7 dias em todos os planos
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Sem compromisso. Cancele a qualquer momento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    R$ {plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">/mês</span>
                </div>
                <p className="text-sm text-green-600 font-medium">
                  7 dias grátis
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Começar Teste Gratuito'
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Cancele a qualquer momento
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Todas as assinaturas incluem:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700">
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
          <p className="text-gray-600">
            Dúvidas sobre os planos?{' '}
            <a
              href="mailto:suporte@agendamais.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Entre em contato
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
