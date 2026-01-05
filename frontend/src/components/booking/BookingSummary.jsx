import { Calendar, Clock, User, Briefcase, DollarSign, MapPin, Phone } from 'lucide-react'

export default function BookingSummary({
  business,
  service,
  professional,
  selectedDate,
  selectedTime,
  clientData
}) {
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

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Confirme seu agendamento</h2>

      <div className="bg-white rounded-xl border overflow-hidden">
        {/* Header do estabelecimento */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <h3 className="font-semibold text-lg">{business?.business_name || business?.name}</h3>
          {(business?.business_address || business?.address) && (
            <p className="text-blue-100 text-sm flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {business.business_address || business.address}
            </p>
          )}
        </div>

        {/* Detalhes do agendamento */}
        <div className="p-6 space-y-4">
          {/* Serviço */}
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Serviço</p>
              <p className="font-semibold text-gray-900">{service?.name}</p>
              <p className="text-sm text-gray-600">{service?.duration} minutos</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">
                R$ {parseFloat(service?.price || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Profissional */}
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profissional</p>
              <p className="font-semibold text-gray-900">
                {professional?.name || selectedTime?.professional_name || 'Qualquer disponível'}
              </p>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="flex items-start gap-3 pb-4 border-b">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Data e Horário</p>
              <p className="font-semibold text-gray-900 capitalize">
                {formatDate(selectedDate)}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {selectedTime?.time} - {selectedTime?.end_time}
              </p>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Seus dados</p>
              <p className="font-semibold text-gray-900">{clientData?.name}</p>
              <p className="text-sm text-gray-600">{clientData?.phone}</p>
              {clientData?.email && (
                <p className="text-sm text-gray-600">{clientData.email}</p>
              )}
            </div>
          </div>

          {clientData?.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Observações:</p>
              <p className="text-sm text-gray-700">{clientData.notes}</p>
            </div>
          )}
        </div>

        {/* Footer com valor total */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Valor total</span>
            <span className="text-2xl font-bold text-green-600">
              R$ {parseFloat(service?.price || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * Pagamento realizado no local
          </p>
        </div>
      </div>

      {/* Política de cancelamento */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-1">Política de cancelamento</h4>
        <p className="text-sm text-blue-700">
          Você pode cancelar ou reagendar gratuitamente com até{' '}
          <strong>{business?.settings?.cancellation_hours || 24} horas</strong> de
          antecedência.
        </p>
      </div>
    </div>
  )
}
