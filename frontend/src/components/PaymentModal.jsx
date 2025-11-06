import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Lock, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../contexts/SubscriptionContext'

// Inicializar Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const PLAN_NAMES = {
  basic: { name: 'Básico', price: 29 },
  pro: { name: 'Pro', price: 59 },
  enterprise: { name: 'Enterprise', price: 99 }
}

export default function PaymentModal() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { refreshSubscription } = useSubscription()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [stripe, setStripe] = useState(null)
  const [cardElement, setCardElement] = useState(null)

  // Dados da assinatura vindos da navegação
  const { clientSecret, subscriptionId, planId } = location.state || {}

  useEffect(() => {
    // Redirecionar se não tiver dados necessários
    if (!clientSecret || !planId) {
      navigate('/subscription/plans')
      return
    }

    // Carregar Stripe
    loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY).then((stripeInstance) => {
      setStripe(stripeInstance)

      // Criar elementos do Stripe
      const elements = stripeInstance.elements()
      const card = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#9e2146'
          }
        },
        hidePostalCode: true
      })

      // Montar no DOM
      card.mount('#card-element')
      setCardElement(card)

      // Listener de erros
      card.on('change', (event) => {
        if (event.error) {
          setError(event.error.message)
        } else {
          setError(null)
        }
      })
    })
  }, [clientSecret, planId, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !cardElement) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Confirmar pagamento com Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.name || '',
              email: user?.email || ''
            }
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        setLoading(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true)

        // Atualizar contexto de assinatura
        await refreshSubscription()

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error('Erro ao processar pagamento:', err)
      setError('Erro ao processar pagamento. Tente novamente.')
      setLoading(false)
    }
  }

  const planInfo = PLAN_NAMES[planId] || {}

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Assinatura Criada!
          </h2>
          <p className="text-gray-600 mb-4">
            Você tem 7 dias de teste gratuito para aproveitar todos os recursos do plano {planInfo.name}.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              Após o período de teste, você será cobrado R$ {planInfo.price}/mês.
              Cancele a qualquer momento.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="grid md:grid-cols-2">
          {/* Left Side - Summary */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Resumo da Assinatura</h2>

            <div className="space-y-4 mb-8">
              <div>
                <p className="text-blue-100 text-sm mb-1">Plano</p>
                <p className="text-2xl font-bold">{planInfo.name}</p>
              </div>

              <div>
                <p className="text-blue-100 text-sm mb-1">Valor</p>
                <p className="text-2xl font-bold">R$ {planInfo.price}/mês</p>
              </div>

              <div className="bg-white/10 rounded-lg p-4 mt-6">
                <p className="text-sm font-medium mb-2">Teste Gratuito</p>
                <p className="text-sm text-blue-100">
                  7 dias grátis para experimentar todos os recursos.
                  Cancele a qualquer momento.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Sem compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pagamento 100% seguro</span>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dados de Pagamento
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              {/* Card Element */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Cartão de Crédito
                </label>
                <div
                  id="card-element"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">
                  Como funciona:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Você inicia seu teste gratuito de 7 dias</li>
                  <li>Após o trial, cobramos R$ {planInfo.price}/mês</li>
                  <li>Cancele a qualquer momento sem taxas</li>
                </ol>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !stripe}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Iniciar Teste Gratuito
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                Ao confirmar, você concorda com nossos{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
