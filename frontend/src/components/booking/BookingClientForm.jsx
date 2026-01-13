import { User, Phone, Mail, MessageSquare } from 'lucide-react'

export default function BookingClientForm({ clientData, onChange, errors = {} }) {
  const formatPhone = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Formata o telefone
    if (numbers.length <= 2) {
      return `(${numbers}`
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    onChange({ ...clientData, phone: formatted })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-jet-black-900">Seus dados</h2>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        {/* Nome */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-jet-black-700 mb-2">
            <User className="w-4 h-4 text-periwinkle-500" />
            Nome completo *
          </label>
          <input
            type="text"
            value={clientData.name}
            onChange={(e) => onChange({ ...clientData, name: e.target.value })}
            placeholder="Digite seu nome completo"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 transition-colors ${
              errors.name ? 'border-red-500' : 'border-jet-black-300'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-jet-black-700 mb-2">
            <Phone className="w-4 h-4 text-periwinkle-500" />
            Telefone / WhatsApp *
          </label>
          <input
            type="tel"
            value={clientData.phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 transition-colors ${
              errors.phone ? 'border-red-500' : 'border-jet-black-300'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-jet-black-500">
            Usaremos este número para confirmar seu agendamento
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-jet-black-700 mb-2">
            <Mail className="w-4 h-4 text-periwinkle-500" />
            Email (opcional)
          </label>
          <input
            type="email"
            value={clientData.email}
            onChange={(e) => onChange({ ...clientData, email: e.target.value })}
            placeholder="seu@email.com"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-jet-black-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Observações */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-jet-black-700 mb-2">
            <MessageSquare className="w-4 h-4 text-periwinkle-500" />
            Observações (opcional)
          </label>
          <textarea
            value={clientData.notes}
            onChange={(e) => onChange({ ...clientData, notes: e.target.value })}
            placeholder="Alguma informação adicional que devemos saber?"
            rows={3}
            className="w-full px-4 py-3 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Importante:</strong> Ao confirmar o agendamento, você receberá uma
          confirmação por WhatsApp. Guarde o código do agendamento para consultas ou
          cancelamentos.
        </p>
      </div>
    </div>
  )
}
