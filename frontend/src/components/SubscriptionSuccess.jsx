import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function SubscriptionSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { verifyCheckout } = useSubscription()

  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setError('Sessão de pagamento não encontrada. Tente novamente.')
      setVerifying(false)
      return
    }

    const verify = async () => {
      try {
        console.log('Verificando checkout com session_id:', sessionId)
        const result = await verifyCheckout(sessionId)

        if (result.success) {
          console.log('Assinatura ativada:', result.subscription)
          setVerified(true)
          // Redirecionar para o dashboard/onboarding após 3 segundos
          setTimeout(() => {
            navigate('/')
          }, 3000)
        } else {
          console.error('Erro na verificação:', result.error)
          setError(result.error || 'Erro ao verificar pagamento')
        }
      } catch (err) {
        console.error('Erro ao verificar checkout:', err)
        setError('Erro ao verificar pagamento. Tente novamente.')
      } finally {
        setVerifying(false)
      }
    }

    verify()
  }, [searchParams, verifyCheckout, navigate])

  // Estado de verificação em andamento
  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verificando Pagamento...
            </h1>

            <p className="text-gray-600">
              Aguarde enquanto confirmamos seu pagamento com o Stripe.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Estado de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Erro na Verificacao
            </h1>

            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Tentar Novamente
              </button>

              <button
                onClick={() => navigate('/subscription/plans')}
                className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar aos Planos
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Estado de sucesso
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assinatura Confirmada!
          </h1>

          <p className="text-gray-600 mb-6">
            Seu periodo de teste de 3 dias comecou. Agora vamos configurar sua conta!
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Seu plano foi ativado com sucesso. A cobranca sera realizada automaticamente apos o periodo de teste.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecionando...</span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Configurar Minha Conta
          </button>
        </div>
      </div>
    </div>
  )
}
