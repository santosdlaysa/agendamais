import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import bookingService from '../../services/publicApi'

export default function BookingPaymentSuccess() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingCode, setBookingCode] = useState(null)

  useEffect(() => {
    if (sessionId) {
      verifyPayment()
    } else {
      setError('Sessão de pagamento não encontrada')
      setLoading(false)
    }
  }, [sessionId])

  const verifyPayment = async () => {
    try {
      setLoading(true)
      const result = await bookingService.verifyPayment(sessionId)

      if (result.success && result.booking_code) {
        setBookingCode(result.booking_code)
        // Redirecionar para página de confirmação após 2 segundos
        setTimeout(() => {
          navigate(`/agendar/${slug}/confirmacao/${result.booking_code}`, {
            state: { paymentConfirmed: true }
          })
        }, 2000)
      } else {
        setError('Não foi possível confirmar o pagamento')
      }
    } catch (err) {
      console.error('Erro ao verificar pagamento:', err)
      setError(err.response?.data?.message || 'Erro ao verificar pagamento')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-jet-black-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Loader2 className="w-16 h-16 text-periwinkle-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold text-jet-black-900 mb-2">
            Verificando pagamento...
          </h1>
          <p className="text-jet-black-600">
            Aguarde enquanto confirmamos seu pagamento.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-jet-black-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-jet-black-900 mb-2">
            Erro no pagamento
          </h1>
          <p className="text-jet-black-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/agendar/${slug}`)}
            className="px-6 py-3 bg-periwinkle-600 text-white rounded-lg font-medium hover:bg-periwinkle-700 transition-colors"
          >
            Fazer novo agendamento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jet-black-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
          Pagamento confirmado!
        </h1>
        <p className="text-jet-black-600 mb-2">
          Seu agendamento foi confirmado com sucesso.
        </p>
        {bookingCode && (
          <p className="text-sm text-jet-black-500 mb-6">
            Código: <span className="font-mono font-bold">{bookingCode}</span>
          </p>
        )}
        <p className="text-sm text-jet-black-500">
          Redirecionando para os detalhes do agendamento...
        </p>
      </div>
    </div>
  )
}
