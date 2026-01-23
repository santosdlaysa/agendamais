import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { XCircle, RefreshCw, Home, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import bookingService from '../../services/publicApi'

export default function BookingPaymentCanceled() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const appointmentId = searchParams.get('appointment_id')

  const [canceling, setCanceling] = useState(false)

  const handleRetry = () => {
    // Voltar para a página de agendamento
    navigate(`/agendar/${slug}`)
  }

  const handleCancelAppointment = async () => {
    if (!appointmentId) {
      navigate(`/agendar/${slug}`)
      return
    }

    try {
      setCanceling(true)
      await bookingService.cancelPendingAppointment(slug, appointmentId)
      toast.success('Agendamento cancelado')
      navigate(`/agendar/${slug}`)
    } catch (err) {
      console.error('Erro ao cancelar:', err)
      // Mesmo com erro, redireciona para página inicial
      navigate(`/agendar/${slug}`)
    } finally {
      setCanceling(false)
    }
  }

  return (
    <div className="min-h-screen bg-jet-black-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-orange-600" />
        </div>

        <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
          Pagamento cancelado
        </h1>

        <p className="text-jet-black-600 mb-8">
          O pagamento foi cancelado. Seu agendamento não foi confirmado.
          Você pode tentar novamente ou fazer um novo agendamento.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-periwinkle-600 text-white rounded-lg font-medium hover:bg-periwinkle-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Fazer novo agendamento
          </button>

          <button
            onClick={handleCancelAppointment}
            disabled={canceling}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-jet-black-300 text-jet-black-700 rounded-lg font-medium hover:bg-jet-black-100 transition-colors disabled:opacity-50"
          >
            {canceling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cancelando...
              </>
            ) : (
              <>
                <Home className="w-5 h-5" />
                Voltar para o início
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-jet-black-500 mt-6">
          Se você teve algum problema com o pagamento, entre em contato com o estabelecimento.
        </p>
      </div>
    </div>
  )
}
