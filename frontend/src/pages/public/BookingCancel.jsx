import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Calendar, Clock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import bookingService from '../../services/publicApi'

export default function BookingCancel() {
  const { slug, code } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [appointment, setAppointment] = useState(null)
  const [error, setError] = useState(null)

  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [phoneError, setPhoneError] = useState('')

  useEffect(() => {
    loadAppointment()
  }, [code])

  const loadAppointment = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAppointment(code)
      setAppointment(data.appointment)

      if (data.appointment.status !== 'scheduled') {
        setError('Este agendamento não pode ser cancelado.')
      } else if (!data.appointment.can_cancel) {
        setError('O prazo para cancelamento já expirou.')
      }
    } catch (err) {
      setError('Agendamento não encontrado.')
    } finally {
      setLoading(false)
    }
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value))
    setPhoneError('')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  const handleCancel = async (e) => {
    e.preventDefault()

    const phoneNumbers = phone.replace(/\D/g, '')
    if (phoneNumbers.length < 10) {
      setPhoneError('Digite o telefone usado no agendamento')
      return
    }

    try {
      setCancelling(true)
      await bookingService.cancelAppointment(code, phone, reason)
      setCancelled(true)
      toast.success('Agendamento cancelado com sucesso')
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao cancelar agendamento'
      if (err.response?.status === 400) {
        setPhoneError('Telefone não confere com o cadastrado')
      } else {
        toast.error(message)
      }
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-jet-black-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-periwinkle-600 animate-spin" />
      </div>
    )
  }

  // Tela de sucesso após cancelamento
  if (cancelled) {
    return (
      <div className="min-h-screen bg-jet-black-50 py-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-jet-black-900 mb-2">Agendamento Cancelado</h1>
          <p className="text-jet-black-600 mb-8">
            Seu agendamento foi cancelado com sucesso.
          </p>
          <Link
            to={`/agendar/${slug}`}
            className="inline-flex items-center px-6 py-3 bg-periwinkle-600 text-white rounded-lg font-medium hover:bg-periwinkle-700 transition-colors"
          >
            Fazer novo agendamento
          </Link>
        </div>
      </div>
    )
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-jet-black-50 py-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-jet-black-900 mb-2">Não foi possível cancelar</h1>
          <p className="text-jet-black-600 mb-8">{error}</p>
          <Link
            to={`/agendar/${slug}`}
            className="inline-flex items-center px-6 py-3 bg-periwinkle-600 text-white rounded-lg font-medium hover:bg-periwinkle-700 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jet-black-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(`/agendar/${slug}`)}
            className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-jet-black-900">Cancelar Agendamento</h1>
            <p className="text-sm text-jet-black-500">Código: {code}</p>
          </div>
        </div>

        {/* Detalhes do agendamento */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-semibold text-jet-black-900 mb-4">Detalhes do agendamento</h2>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-jet-black-400" />
              <span className="text-jet-black-700 capitalize">
                {formatDate(appointment?.appointment_date)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-jet-black-400" />
              <span className="text-jet-black-700">
                {appointment?.start_time} - {appointment?.end_time}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-jet-black-400" />
              <span className="text-jet-black-700">
                {appointment?.service?.name} com {appointment?.professional?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">Atenção</h3>
              <p className="text-sm text-yellow-700 mt-1">
                O cancelamento é irreversível. Se desejar agendar novamente,
                precisará fazer um novo agendamento.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de cancelamento */}
        <form onSubmit={handleCancel} className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-jet-black-900 mb-4">Confirmar cancelamento</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Telefone cadastrado *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  phoneError ? 'border-red-500' : 'border-jet-black-300'
                }`}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
              <p className="mt-1 text-xs text-jet-black-500">
                Digite o mesmo telefone usado no agendamento
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Motivo do cancelamento (opcional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Conte-nos o motivo do cancelamento..."
                rows={3}
                className="w-full px-4 py-3 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cancelling}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {cancelling && <Loader2 className="w-5 h-5 animate-spin" />}
            {cancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </button>
        </form>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-jet-black-600 hover:text-jet-black-800"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  )
}
