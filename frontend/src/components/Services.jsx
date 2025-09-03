import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  DollarSign,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Services() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get('/services')
      setServices(response.data.services || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      await api.post(`/services/${serviceId}/toggle-status`)
      toast.success(`Serviço ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`)
      fetchServices()
    } catch (error) {
      console.error('Erro ao alterar status do serviço:', error)
      toast.error('Erro ao alterar status do serviço')
    }
  }

  const handleDelete = async (serviceId, serviceName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o serviço "${serviceName}"?`)) {
      return
    }

    try {
      await api.delete(`/services/${serviceId}`)
      toast.success('Serviço excluído com sucesso!')
      fetchServices()
    } catch (error) {
      console.error('Erro ao excluir serviço:', error)
      const message = error.response?.data?.message || 'Erro ao excluir serviço'
      toast.error(message)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = showInactive || service.active

    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <button
          onClick={() => navigate('/services/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
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
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showInactive" className="text-sm text-gray-700">
              Mostrar inativos
            </label>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {services.length === 0 ? 'Nenhum serviço cadastrado' : 'Nenhum serviço encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {services.length === 0 
                ? 'Comece cadastrando o primeiro serviço do seu negócio'
                : 'Tente ajustar os filtros ou termos de busca'
              }
            </p>
            {services.length === 0 && (
              <button
                onClick={() => navigate('/services/new')}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {service.name}
                      </h3>
                      {!service.active && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inativo
                        </span>
                      )}
                    </div>
                    
                    {service.description && (
                      <p className="text-gray-600 mt-1">{service.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        R$ {parseFloat(service.price).toFixed(2)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} min
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {service.professionals ? service.professionals.length : 0} profissionais
                      </div>
                    </div>

                    {service.professionals && service.professionals.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-2">
                          {service.professionals.map((professional) => (
                            <span
                              key={professional.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {professional.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(service.id, service.active)}
                      className={`p-2 rounded-lg border ${
                        service.active
                          ? 'text-red-600 hover:bg-red-50 border-red-200'
                          : 'text-green-600 hover:bg-green-50 border-green-200'
                      }`}
                      title={service.active ? 'Desativar serviço' : 'Ativar serviço'}
                    >
                      {service.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/services/${service.id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg"
                      title="Editar serviço"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(service.id, service.name)}
                      className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                      title="Excluir serviço"
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

      {/* Summary */}
      {services.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              <p className="text-sm text-gray-600">Total de Serviços</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.active).length}
              </p>
              <p className="text-sm text-gray-600">Serviços Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                R$ {services.reduce((acc, service) => acc + parseFloat(service.price), 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Valor Total dos Serviços</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}