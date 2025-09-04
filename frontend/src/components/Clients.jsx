import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Phone, 
  Mail,
  Calendar,
  FileText,
  User
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Clients() {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchClients()
  }, [searchTerm, currentPage])

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20,
        include_stats: 'true'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const url = `/clients?${params}`
      console.log('Fazendo requisição para:', url)
      console.log('Base URL da API:', api.defaults.baseURL)
      
      const response = await api.get(url)
      console.log('Resposta da API:', response.data)
      
      setClients(response.data.clients || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      console.error('Detalhes do erro:', error.response?.data)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (clientId, clientName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?`)) {
      return
    }

    try {
      await api.delete(`/clients/${clientId}`)
      toast.success('Cliente excluído com sucesso!')
      fetchClients()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      const message = error.response?.data?.message || 'Erro ao excluir cliente'
      toast.error(message)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => navigate('/clients/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar clientes por nome, telefone ou email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {clients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando o primeiro cliente do seu negócio'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate('/clients/new')}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {clients.map((client) => (
              <div key={client.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {client.name}
                        </h3>
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                          {client.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {client.phone}
                            </div>
                          )}
                          {client.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {client.email}
                            </div>
                          )}
                        </div>

                        {client.notes && (
                          <div className="mt-2">
                            <div className="flex items-start">
                              <FileText className="w-4 h-4 mr-1 text-gray-400 mt-0.5" />
                              <p className="text-sm text-gray-600">{client.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        {client.stats && (
                          <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {client.stats.total_appointments || 0} agendamentos
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {client.stats.completed_appointments || 0} concluídos
                            </div>
                            {client.stats.last_appointment_date && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Último: {new Date(client.stats.last_appointment_date).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-400">
                          Cadastrado em: {new Date(client.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg"
                      title="Editar cliente"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(client.id, client.name)}
                      className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                      title="Excluir cliente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {pagination.page} de {pagination.pages} 
              ({pagination.total} clientes no total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = Math.max(1, pagination.page - 2) + i
                if (page > pagination.pages) return null
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      page === pagination.page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {clients.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || clients.length}</p>
              <p className="text-sm text-gray-600">Total de Clientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {clients.reduce((acc, client) => acc + (client.stats?.completed_appointments || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Agendamentos Concluídos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {clients.reduce((acc, client) => acc + (client.stats?.total_appointments || 0), 0)}
              </p>
              <p className="text-sm text-gray-600">Total de Agendamentos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}