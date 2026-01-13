import { useState, useEffect } from 'react'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import { professionalApi } from '../../services/professionalApi'
import toast from 'react-hot-toast'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function ProfessionalSchedule() {
  const { professional } = useProfessionalAuth()
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState('week') // 'day' or 'week'
  const [schedule, setSchedule] = useState([])
  const [completingId, setCompletingId] = useState(null)

  const fetchSchedule = async () => {
    setLoading(true)
    try {
      const startDate = getStartOfWeek(currentDate)
      const endDate = getEndOfWeek(currentDate)

      const data = await professionalApi.getSchedule(
        formatDateForApi(startDate),
        formatDateForApi(endDate)
      )
      setSchedule(data.appointments || [])
    } catch (error) {
      console.error('Erro ao carregar agenda:', error)
      toast.error('Erro ao carregar agenda')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [currentDate])

  const formatDateForApi = (date) => {
    return date.toISOString().split('T')[0]
  }

  const getStartOfWeek = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date)
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
  }

  const getWeekDays = () => {
    const start = getStartOfWeek(currentDate)
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const formatDayName = (date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
  }

  const formatTime = (time) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction * 7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAppointmentsForDay = (date) => {
    const dateStr = formatDateForApi(date)
    return schedule.filter(apt => apt.appointment_date === dateStr)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'completed':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800'
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800'
      case 'no_show':
        return 'bg-gray-100 border-gray-300 text-gray-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const handleCompleteAppointment = async (appointmentId) => {
    setCompletingId(appointmentId)
    try {
      await professionalApi.completeAppointment(appointmentId, {
        notes: 'Concluido via agenda'
      })
      toast.success('Atendimento concluido!')
      fetchSchedule()
    } catch (error) {
      toast.error('Erro ao concluir atendimento')
    } finally {
      setCompletingId(null)
    }
  }

  const weekDays = getWeekDays()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-jet-black-900">Minha Agenda</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Hoje
            </button>

            <button
              onClick={() => navigateWeek(1)}
              className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Week Range */}
        <p className="text-sm text-jet-black-500 mt-2">
          {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        /* Week View */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const appointments = getAppointmentsForDay(day)
            const dayIsToday = isToday(day)

            return (
              <div
                key={index}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                  dayIsToday ? 'ring-2 ring-emerald-500' : ''
                }`}
              >
                {/* Day Header */}
                <div className={`p-3 text-center border-b ${
                  dayIsToday ? 'bg-emerald-50' : 'bg-jet-black-50'
                }`}>
                  <p className={`text-xs font-medium uppercase ${
                    dayIsToday ? 'text-emerald-600' : 'text-jet-black-500'
                  }`}>
                    {formatDayName(day)}
                  </p>
                  <p className={`text-lg font-bold ${
                    dayIsToday ? 'text-emerald-600' : 'text-jet-black-900'
                  }`}>
                    {day.getDate()}
                  </p>
                </div>

                {/* Appointments */}
                <div className="p-2 space-y-2 min-h-[200px]">
                  {appointments.length === 0 ? (
                    <p className="text-xs text-jet-black-400 text-center py-4">
                      Sem agendamentos
                    </p>
                  ) : (
                    appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-2 rounded-lg border text-xs ${getStatusColor(apt.status)}`}
                      >
                        <div className="flex items-center gap-1 font-semibold mb-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(apt.start_time)}
                        </div>
                        <p className="font-medium truncate">{apt.client_name}</p>
                        <p className="text-[10px] opacity-75 truncate">{apt.service_name}</p>

                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => handleCompleteAppointment(apt.id)}
                            disabled={completingId === apt.id}
                            className="mt-2 w-full flex items-center justify-center gap-1 py-1 bg-white/50 hover:bg-white rounded text-[10px] font-medium transition-colors"
                          >
                            {completingId === apt.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Concluir
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <p className="text-sm font-medium text-jet-black-700 mb-3">Legenda</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-300"></div>
            <span className="text-sm text-jet-black-600">Agendado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-200 border border-emerald-300"></div>
            <span className="text-sm text-jet-black-600">Concluido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
            <span className="text-sm text-jet-black-600">Cancelado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div>
            <span className="text-sm text-jet-black-600">Faltou</span>
          </div>
        </div>
      </div>
    </div>
  )
}
