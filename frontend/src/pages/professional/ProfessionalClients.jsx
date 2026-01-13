import { useState, useEffect } from 'react'
import { professionalApi } from '../../services/professionalApi'
import toast from 'react-hot-toast'
import {
  Users,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  Loader2,
  ChevronRight,
  Clock
} from 'lucide-react'

export default function ProfessionalClients() {
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientHistory, setClientHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const fetchClients = async () => {
    setLoading(true)
    try {
      const data = await professionalApi.getClients({ search })
      setClients(data.clients || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const fetchClientHistory = async (clientId) => {
    setLoadingHistory(true)
    try {
      const data = await professionalApi.getClient(clientId)
      setClientHistory(data.appointments || [])
    } catch (error) {
      console.error('Erro ao carregar historico:', error)
      toast.error('Erro ao carregar historico')
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClients()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleSelectClient = (client) => {
    setSelectedClient(client)
    fetchClientHistory(client.id)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr).toLocaleDateString('pt-BR')
  }

  const formatTime = (time) => {
    if (!time) return '--:--'
    return time.substring(0, 5)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-700'
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'no_show':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado'
      case 'completed':
        return 'Concluido'
      case 'cancelled':
        return 'Cancelado'
      case 'no_show':
        return 'Faltou'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-jet-black-900">Meus Clientes</h1>
        </div>
        <p className="text-sm text-jet-black-500 mt-1">
          Clientes que voce ja atendeu
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-black-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-jet-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
                <p className="text-jet-black-500">Nenhum cliente encontrado</p>
              </div>
            ) : (
              <div className="divide-y">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className={`w-full p-4 text-left hover:bg-jet-black-50 transition-colors flex items-center gap-3 ${
                      selectedClient?.id === client.id ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-jet-black-900 truncate">{client.name}</p>
                      <p className="text-sm text-jet-black-500 truncate">{client.phone}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-jet-black-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-6">
              {/* Client Info Card */}
              <div className="bg-white rounded-xl border shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-jet-black-900">{selectedClient.name}</h2>

                    <div className="mt-3 space-y-2">
                      {selectedClient.phone && (
                        <div className="flex items-center gap-2 text-jet-black-600">
                          <Phone className="w-4 h-4" />
                          <span>{selectedClient.phone}</span>
                        </div>
                      )}
                      {selectedClient.email && (
                        <div className="flex items-center gap-2 text-jet-black-600">
                          <Mail className="w-4 h-4" />
                          <span>{selectedClient.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-6">
                      <div>
                        <p className="text-2xl font-bold text-jet-black-900">
                          {selectedClient.total_appointments || 0}
                        </p>
                        <p className="text-sm text-jet-black-500">Atendimentos</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">
                          {selectedClient.completed_appointments || 0}
                        </p>
                        <p className="text-sm text-jet-black-500">Concluidos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className="bg-white rounded-xl border shadow-sm">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-jet-black-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Historico de Atendimentos
                  </h3>
                </div>

                <div className="p-4">
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                    </div>
                  ) : clientHistory.length === 0 ? (
                    <p className="text-center py-8 text-jet-black-500">
                      Nenhum historico encontrado
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {clientHistory.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center gap-4 p-3 bg-jet-black-50 rounded-xl"
                        >
                          <div className="text-center min-w-[80px]">
                            <p className="text-sm font-medium text-jet-black-900">
                              {formatDate(apt.appointment_date)}
                            </p>
                            <p className="text-xs text-jet-black-500">
                              {formatTime(apt.start_time)}
                            </p>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-jet-black-900 truncate">
                              {apt.service_name}
                            </p>
                            {apt.notes && (
                              <p className="text-sm text-jet-black-500 truncate">
                                {apt.notes}
                              </p>
                            )}
                          </div>

                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                            {getStatusLabel(apt.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
              <Users className="w-16 h-16 text-jet-black-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-jet-black-900 mb-2">
                Selecione um cliente
              </h3>
              <p className="text-jet-black-500">
                Clique em um cliente na lista para ver os detalhes e historico de atendimentos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
