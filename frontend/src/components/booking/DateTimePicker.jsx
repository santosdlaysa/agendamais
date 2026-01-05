import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react'

export default function DateTimePicker({
  availability,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  loading,
  minDate = new Date()
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateAvailable = (date) => {
    const dateStr = formatDate(date)
    return availability?.[dateStr]?.available && availability?.[dateStr]?.slots?.length > 0
  }

  const isDatePast = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDateInRange = (date) => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30) // 30 dias de antecedência
    return date <= maxDate
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const renderCalendar = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const startDay = firstDayOfMonth(currentMonth)
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

    // Cabeçalho dos dias da semana
    const header = weekDays.map((day) => (
      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
        {day}
      </div>
    ))

    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />)
    }

    // Dias do mês
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateStr = formatDate(date)
      const isPast = isDatePast(date)
      const isAvailable = isDateAvailable(date)
      const isSelected = selectedDate === dateStr
      const isInRange = isDateInRange(date)

      let className = 'p-2 text-center rounded-lg text-sm transition-all duration-200 '

      if (isSelected) {
        className += 'bg-blue-600 text-white font-semibold'
      } else if (isPast || !isInRange) {
        className += 'text-gray-300 cursor-not-allowed'
      } else if (isAvailable) {
        className += 'text-gray-900 hover:bg-blue-100 cursor-pointer font-medium'
      } else {
        className += 'text-gray-400 cursor-not-allowed line-through'
      }

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast && isAvailable && isInRange) {
              onSelectDate(dateStr)
              onSelectTime(null) // Reset time when date changes
            }
          }}
          disabled={isPast || !isAvailable || !isInRange}
          className={className}
        >
          {day}
        </button>
      )
    }

    return (
      <div>
        <div className="grid grid-cols-7 gap-1">{header}</div>
        <div className="grid grid-cols-7 gap-1 mt-2">{days}</div>
      </div>
    )
  }

  const getTimeSlotsForDate = () => {
    if (!selectedDate || !availability?.[selectedDate]) return []
    return availability[selectedDate].slots || []
  }

  const timeSlots = getTimeSlotsForDate()

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        Escolha a data e horário
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            renderCalendar()
          )}

          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span>Selecionado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-100 border" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gray-200" />
              <span>Indisponível</span>
            </div>
          </div>
        </div>

        {/* Horários */}
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Horários disponíveis
          </h3>

          {!selectedDate ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Selecione uma data primeiro
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Nenhum horário disponível nesta data
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-72 overflow-y-auto">
              {timeSlots.map((slot, index) => {
                const isSelected = selectedTime?.time === slot.time
                return (
                  <button
                    key={index}
                    onClick={() => onSelectTime(slot)}
                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                    }`}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          )}

          {selectedTime && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Horário selecionado:</span>{' '}
                {selectedTime.time} - {selectedTime.end_time}
                {selectedTime.professional_name && (
                  <span className="block mt-1">
                    Profissional: {selectedTime.professional_name}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
