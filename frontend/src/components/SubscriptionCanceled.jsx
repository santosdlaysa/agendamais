import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function SubscriptionCanceled() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-jet-black-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
            Assinatura Cancelada
          </h1>

          <p className="text-jet-black-600 mb-6">
            O processo de assinatura foi cancelado. Você pode tentar novamente quando quiser.
          </p>

          <div className="bg-jet-black-50 border border-jet-black-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-jet-black-700">
              Nenhuma cobrança foi realizada. Seus dados de pagamento não foram salvos.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription/plans')}
              className="w-full py-3 px-6 bg-periwinkle-600 hover:bg-periwinkle-700 text-white rounded-lg font-semibold transition-colors"
            >
              Tentar Novamente
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 px-6 bg-jet-black-100 hover:bg-jet-black-200 text-jet-black-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
