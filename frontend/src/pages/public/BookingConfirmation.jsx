import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Copy,
  ExternalLink,
  Loader2,
  CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'
import bookingService from '../../services/publicApi'

export default function BookingConfirmation() {
  const { slug, code } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Pegar código da URL (path param ou query param)
  const codeFromQuery = searchParams.get('code')
  const paymentStatus = searchParams.get('payment') // 'success' ou 'cancelled'

  const [appointment, setAppointment] = useState(location.state?.appointment || null)
  const [bookingCode, setBookingCode] = useState(location.state?.bookingCode || code || codeFromQuery)
  const [loading, setLoading] = useState(!location.state?.appointment)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!appointment && bookingCode) {
      loadAppointment()
    }
  }, [bookingCode])

  const loadAppointment = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAppointment(bookingCode)
      setAppointment(data.appointment)
      if (data.appointment?.booking_code) {
        setBookingCode(data.appointment.booking_code)
      }
    } catch (err) {
      setError('Agendamento não encontrado')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(bookingCode)
    toast.success('Código copiado!')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const addToGoogleCalendar = () => {
    if (!appointment) return

    const startDate = `${appointment.appointment_date.replace(/-/g, '')}T${appointment.start_time.replace(':', '')}00`
    const endDate = `${appointment.appointment_date.replace(/-/g, '')}T${appointment.end_time.replace(':', '')}00`

    const title = encodeURIComponent(`${appointment.service?.name} - ${appointment.business?.name}`)

    // Descrição detalhada com todos os campos selecionados
    const descriptionLines = [
      `Código do Agendamento: ${bookingCode}`,
      '',
      '--- Detalhes do Agendamento ---',
      `Serviço: ${appointment.service?.name}`,
      `Duração: ${appointment.service?.duration || ''} minutos`,
      `Profissional: ${appointment.professional?.name}`,
      `Data: ${formatDate(appointment.appointment_date)}`,
      `Horário: ${appointment.start_time} - ${appointment.end_time}`,
      `Valor: R$ ${parseFloat(appointment.service?.price || 0).toFixed(2)}`,
      '',
      '--- Estabelecimento ---',
      `Local: ${appointment.business?.name}`,
      appointment.business?.address ? `Endereço: ${appointment.business.address}` : '',
      appointment.business?.phone ? `Telefone: ${appointment.business.phone}` : '',
      '',
      appointment.notes ? `Observações: ${appointment.notes}` : ''
    ].filter(line => line !== '').join('\n')

    const details = encodeURIComponent(descriptionLines)
    const location = encodeURIComponent(appointment.business?.address || '')

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`

    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-jet-black-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-periwinkle-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-jet-black-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-jet-black-900 mb-2">Agendamento não encontrado</h1>
          <p className="text-jet-black-600 mb-4">{error}</p>
          <Link
            to={`/agendar/${slug}`}
            className="text-periwinkle-600 hover:text-periwinkle-800 underline"
          >
            Fazer novo agendamento
          </Link>
        </div>
      </div>
    )
  }

  // Verificar se o pagamento foi cancelado
  const isPaymentCancelled = paymentStatus === 'cancelled'
  const isPaymentSuccess = paymentStatus === 'success'
  const isPendingPayment = appointment?.status === 'pending_payment' || appointment?.payment_status === 'pending'

  return (
    <div className="min-h-screen bg-jet-black-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header baseado no status do pagamento */}
        {isPaymentCancelled ? (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
              Pagamento Cancelado
            </h1>
            <p className="text-jet-black-600">
              O pagamento foi cancelado. Seu agendamento ainda não foi confirmado.
            </p>
          </div>
        ) : isPaymentSuccess ? (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
              Pagamento Confirmado!
            </h1>
            <p className="text-jet-black-600">
              Seu pagamento foi processado e o agendamento está confirmado.
            </p>
          </div>
        ) : isPendingPayment ? (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
              Aguardando Pagamento
            </h1>
            <p className="text-jet-black-600">
              Seu agendamento será confirmado após o pagamento.
            </p>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
              Agendamento Confirmado!
            </h1>
            <p className="text-jet-black-600">
              Seu agendamento foi realizado com sucesso.
            </p>
          </div>
        )}

        {/* Código do agendamento */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <p className="text-sm text-jet-black-500 mb-2 text-center">Código do agendamento</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-mono font-bold text-periwinkle-600">{bookingCode}</span>
            <button
              onClick={copyCode}
              className="p-2 text-jet-black-400 hover:text-jet-black-600 hover:bg-jet-black-100 rounded-lg transition-colors"
              title="Copiar código"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-jet-black-400 text-center mt-2">
            Guarde este código para consultas ou cancelamentos
          </p>
        </div>

        {/* Detalhes do agendamento */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-periwinkle-600 to-periwinkle-700 p-4 text-white">
            <h2 className="font-semibold">{appointment?.business?.name}</h2>
          </div>

          <div className="p-6 space-y-4">
            {/* Serviço */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-periwinkle-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-periwinkle-600" />
              </div>
              <div>
                <p className="text-sm text-jet-black-500">Serviço</p>
                <p className="font-semibold text-jet-black-900">{appointment?.service?.name}</p>
              </div>
            </div>

            {/* Data e Hora */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-jet-black-500">Data e Horário</p>
                <p className="font-semibold text-jet-black-900 capitalize">
                  {formatDate(appointment?.appointment_date)}
                </p>
                <p className="text-sm text-jet-black-600">
                  {appointment?.start_time} - {appointment?.end_time}
                </p>
              </div>
            </div>

            {/* Profissional */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-jet-black-500">Profissional</p>
                <p className="font-semibold text-jet-black-900">{appointment?.professional?.name}</p>
              </div>
            </div>

            {/* Endereço */}
            {appointment?.business?.address && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Endereço</p>
                  <p className="font-semibold text-jet-black-900">{appointment?.business?.address}</p>
                </div>
              </div>
            )}

            {/* Telefone */}
            {appointment?.business?.phone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Telefone</p>
                  <a
                    href={`tel:${appointment?.business?.phone}`}
                    className="font-semibold text-periwinkle-600 hover:text-periwinkle-800"
                  >
                    {appointment?.business?.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Valor */}
          <div className="bg-jet-black-50 p-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Valor</span>
              <span className="text-xl font-bold text-green-600">
                R$ {parseFloat(appointment?.service?.price || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <button
            onClick={addToGoogleCalendar}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-jet-black-300 rounded-lg font-medium text-jet-black-700 hover:bg-jet-black-50 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Adicionar ao Google Calendar
          </button>

          <Link
            to={`/agendar/${slug}`}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-periwinkle-600 rounded-lg font-medium text-white hover:bg-periwinkle-700 transition-colors"
          >
            Fazer novo agendamento
          </Link>

          <Link
            to={`/agendar/${slug}/cancelar/${bookingCode}`}
            className="w-full text-center text-sm text-red-600 hover:text-red-800 py-2"
          >
            Precisa cancelar? Clique aqui
          </Link>
        </div>
      </div>
    </div>
  )
}
