import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useSubscription } from '../contexts/SubscriptionContext'

export default function SubscriptionSuccess() {
  const navigate = useNavigate()
  const { refreshSubscription } = useSubscription()

  useEffect(() => {
    // Atualizar status da assinatura após retorno do Stripe
    const updateAndRedirect = async () => {
      await refreshSubscription()
      // Redirecionar para gerenciamento após 3 segundos
      setTimeout(() => {
        navigate('/subscription/manage')
      }, 3000)
    }
    updateAndRedirect()
  }, [refreshSubscription, navigate])

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
            Seu período de teste de 7 dias começou. Aproveite todos os recursos do plano!
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              Seu cartão foi cadastrado com sucesso. A cobrança será realizada automaticamente após o período de teste.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecionando...</span>
          </div>

          <button
            onClick={() => navigate('/subscription/manage')}
            className="mt-6 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Ver Minha Assinatura
          </button>
        </div>
      </div>
    </div>
  )
}
