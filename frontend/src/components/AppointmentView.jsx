import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  Briefcase,
  DollarSign,
  FileText,
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import CompleteAppointmentModal from './CompleteAppointmentModal'

const STATUS_CONFIG = {
  scheduled: {
    label: 'Agendado',
    color: 'bg-periwinkle-100 text-periwinkle-800 border-periwinkle-200',
    icon: Calendar
  },
  completed: {
    label: 'Concluído',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  no_show: {
    label: 'Faltou',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertCircle
  }
}

export default function AppointmentView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  useEffect(() => {
    fetchAppointment()
  }, [id])

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${id}`)
      setAppointment(response.data.appointment)
    } catch (error) {
      toast.error('Erro ao carregar agendamento')
      navigate('/appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.put(`/appointments/${id}/status`, { status: newStatus })
      toast.success(`Status atualizado para ${STATUS_CONFIG[newStatus].label}`)
      fetchAppointment()
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const handleCompleteSuccess = () => {
    setShowCompleteModal(false)
    fetchAppointment()
    toast.success('Agendamento concluído com sucesso!')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString?.substring(0, 5)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  if (!appointment) {
    return null
  }

  const StatusIcon = STATUS_CONFIG[appointment.status]?.icon || Calendar

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-jet-black-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-jet-black-900">Detalhes do Agendamento</h1>
            <p className="text-jet-black-600">#{appointment.id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/appointments/${id}/edit`)}
          className="flex items-center gap-2 px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      {/* Status Banner */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${STATUS_CONFIG[appointment.status]?.color}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className="w-6 h-6" />
          <div>
            <p className="font-semibold">{STATUS_CONFIG[appointment.status]?.label}</p>
            <p className="text-sm opacity-80">Status atual do agendamento</p>
          </div>
        </div>

        {appointment.status === 'scheduled' && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Concluir
            </button>
            <button
              onClick={() => handleUpdateStatus('cancelled')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={() => handleUpdateStatus('no_show')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Faltou
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Data e Horário */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h2 className="text-lg font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-periwinkle-600" />
            Data e Horário
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-jet-black-500">Data</p>
              <p className="text-jet-black-900 font-medium capitalize">{formatDate(appointment.appointment_date)}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-jet-black-500">Início</p>
                <p className="text-jet-black-900 font-medium text-xl">{formatTime(appointment.start_time)}</p>
              </div>
              <div>
                <p className="text-sm text-jet-black-500">Término</p>
                <p className="text-jet-black-900 font-medium text-xl">{formatTime(appointment.end_time)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Serviço */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h2 className="text-lg font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-periwinkle-600" />
            Serviço
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-jet-black-500">Nome do Serviço</p>
              <p className="text-jet-black-900 font-medium">{appointment.service?.name}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-sm text-jet-black-500">Duração</p>
                <p className="text-jet-black-900 font-medium">{appointment.service?.duration} min</p>
              </div>
              <div>
                <p className="text-sm text-jet-black-500">Valor</p>
                <p className="text-jet-black-900 font-medium text-xl text-green-600">
                  R$ {parseFloat(appointment.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h2 className="text-lg font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-periwinkle-600" />
            Cliente
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-periwinkle-400 to-space-indigo-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                {appointment.client?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-jet-black-900 font-medium">{appointment.client?.name}</p>
                {appointment.client?.email && (
                  <p className="text-sm text-jet-black-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {appointment.client.email}
                  </p>
                )}
              </div>
            </div>
            {appointment.client?.phone && (
              <div className="flex items-center gap-2 text-jet-black-600">
                <Phone className="w-4 h-4" />
                {appointment.client.phone}
              </div>
            )}
          </div>
        </div>

        {/* Profissional */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h2 className="text-lg font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-periwinkle-600" />
            Profissional
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg"
                style={{ backgroundColor: appointment.professional?.color || '#6366f1' }}
              >
                {appointment.professional?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-jet-black-900 font-medium">{appointment.professional?.name}</p>
                {appointment.professional?.email && (
                  <p className="text-sm text-jet-black-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {appointment.professional.email}
                  </p>
                )}
              </div>
            </div>
            {appointment.professional?.phone && (
              <div className="flex items-center gap-2 text-jet-black-600">
                <Phone className="w-4 h-4" />
                {appointment.professional.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Observações */}
      {appointment.notes && (
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h2 className="text-lg font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-periwinkle-600" />
            Observações
          </h2>
          <p className="text-jet-black-700 whitespace-pre-wrap">{appointment.notes}</p>
        </div>
      )}

      {/* Complete Appointment Modal */}
      {showCompleteModal && (
        <CompleteAppointmentModal
          appointment={appointment}
          onComplete={handleCompleteSuccess}
          onClose={() => setShowCompleteModal(false)}
        />
      )}
    </div>
  )
}
