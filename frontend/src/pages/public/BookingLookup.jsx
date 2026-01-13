import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Search, ArrowLeft, Loader2, Calendar, Clock, User, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import bookingService from '../../services/publicApi'

export default function BookingLookup() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [appointment, setAppointment] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!code.trim()) {
      toast.error('Digite o código do agendamento')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setAppointment(null)

      const data = await bookingService.getAppointment(code.trim().toUpperCase())
      setAppointment(data.appointment)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Agendamento não encontrado. Verifique o código e tente novamente.')
      } else {
        setError('Erro ao buscar agendamento. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
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

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-periwinkle-100 text-periwinkle-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-jet-black-100 text-jet-black-800',
      cancelled: 'bg-red-100 text-red-800',
      no_show: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || 'bg-jet-black-100 text-jet-black-800'
  }

  const getStatusText = (status) => {
    const texts = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Não compareceu'
    }
    return texts[status] || status
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
            <h1 className="text-xl font-bold text-jet-black-900">Consultar Agendamento</h1>
            <p className="text-sm text-jet-black-500">Digite o código para ver os detalhes</p>
          </div>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <label className="block text-sm font-medium text-jet-black-700 mb-2">
            Código do Agendamento
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: AGD-2025-ABC123"
              className="flex-1 px-4 py-3 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 font-mono uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-periwinkle-600 text-white rounded-lg font-medium hover:bg-periwinkle-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Buscar
            </button>
          </div>
        </form>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Resultado */}
        {appointment && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Status */}
            <div className="p-4 border-b flex items-center justify-between">
              <span className="text-sm text-jet-black-500">Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            {/* Detalhes */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-periwinkle-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-periwinkle-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Data</p>
                  <p className="font-semibold text-jet-black-900 capitalize">
                    {formatDate(appointment.appointment_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Horário</p>
                  <p className="font-semibold text-jet-black-900">
                    {appointment.start_time} - {appointment.end_time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Serviço</p>
                  <p className="font-semibold text-jet-black-900">{appointment.service?.name}</p>
                  <p className="text-sm text-jet-black-600">com {appointment.professional?.name}</p>
                </div>
              </div>
            </div>

            {/* Valor */}
            <div className="bg-jet-black-50 p-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-jet-black-600">Valor</span>
                <span className="text-xl font-bold text-green-600">
                  R$ {parseFloat(appointment.service?.price || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Ações */}
            {appointment.status === 'scheduled' && appointment.can_cancel && (
              <div className="p-4 border-t">
                <Link
                  to={`/agendar/${slug}/cancelar/${code}`}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Cancelar agendamento
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Link para novo agendamento */}
        <div className="text-center mt-8">
          <Link
            to={`/agendar/${slug}`}
            className="text-periwinkle-600 hover:text-periwinkle-800 underline"
          >
            Fazer novo agendamento
          </Link>
        </div>
      </div>
    </div>
  )
}
