import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  Phone, 
  Mail,
  Briefcase,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Professionals() {
  const navigate = useNavigate()
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const fetchProfessionals = async () => {
    try {
      const response = await api.get('/professionals?include_services=true&include_stats=true')
      setProfessionals(response.data.professionals || [])
    } catch (error) {
      toast.error('Erro ao carregar profissionais')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (professionalId, currentStatus) => {
    try {
      await api.post(`/professionals/${professionalId}/toggle-status`)
      toast.success(`Profissional ${currentStatus ? 'desativado' : 'ativado'} com sucesso!`)
      fetchProfessionals()
    } catch (error) {
      toast.error('Erro ao alterar status do profissional')
    }
  }

  const handleDelete = async (professionalId, professionalName) => {
    if (!window.confirm(`Tem certeza que deseja excluir o profissional "${professionalName}"?`)) {
      return
    }

    try {
      await api.delete(`/professionals/${professionalId}`)
      toast.success('Profissional excluído com sucesso!')
      fetchProfessionals()
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao excluir profissional'
      toast.error(message)
    }
  }

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (professional.role && professional.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (professional.phone && professional.phone.includes(searchTerm)) ||
                         (professional.email && professional.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = showInactive || professional.active

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Profissionais</h1>
          <p className="text-jet-black-600">Gerencie os profissionais do seu negócio</p>
        </div>
        <button
          onClick={() => navigate('/professionals/new')}
          className="flex items-center px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Profissional
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-jet-black-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar profissionais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 text-periwinkle-600 border-jet-black-300 rounded focus:ring-periwinkle-500"
            />
            <label htmlFor="showInactive" className="text-sm text-jet-black-700">
              Mostrar inativos
            </label>
          </div>
        </div>
      </div>

      {/* Professionals List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-jet-black-400 mb-4">
              <UserCheck className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-2">
              {professionals.length === 0 ? 'Nenhum profissional cadastrado' : 'Nenhum profissional encontrado'}
            </h3>
            <p className="text-jet-black-600 mb-6">
              {professionals.length === 0 
                ? 'Comece cadastrando o primeiro profissional do seu negócio'
                : 'Tente ajustar os filtros ou termos de busca'
              }
            </p>
            {professionals.length === 0 && (
              <button
                onClick={() => navigate('/professionals/new')}
                className="flex items-center mx-auto px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Profissional
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-jet-black-200">
            {filteredProfessionals.map((professional) => (
              <div key={professional.id} className="p-6 hover:bg-jet-black-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-periwinkle-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-periwinkle-600" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-jet-black-900">
                            {professional.name}
                          </h3>
                          {!professional.active && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Inativo
                            </span>
                          )}
                        </div>
                        
                        {professional.role && (
                          <p className="text-jet-black-600 mt-1">{professional.role}</p>
                        )}
                        
                        <div className="flex items-center space-x-6 mt-2 text-sm text-jet-black-500">
                          {professional.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {professional.phone}
                            </div>
                          )}
                          {professional.email && (
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {professional.email}
                            </div>
                          )}
                        </div>

                        {/* Services */}
                        {professional.services && professional.services.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center mb-2">
                              <Briefcase className="w-4 h-4 mr-1 text-jet-black-400" />
                              <span className="text-sm text-jet-black-500">Serviços:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {professional.services.map((service) => (
                                <span
                                  key={service.id}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stats */}
                        {professional.stats && (
                          <div className="mt-3 flex items-center space-x-6 text-sm text-jet-black-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {professional.stats.total_appointments || 0} agendamentos
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {professional.stats.completed_appointments || 0} concluídos
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleStatus(professional.id, professional.active)}
                      className={`p-2 rounded-lg border ${
                        professional.active
                          ? 'text-red-600 hover:bg-red-50 border-red-200'
                          : 'text-green-600 hover:bg-green-50 border-green-200'
                      }`}
                      title={professional.active ? 'Desativar profissional' : 'Ativar profissional'}
                    >
                      {professional.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => navigate(`/professionals/${professional.id}/edit`)}
                      className="p-2 text-periwinkle-600 hover:bg-periwinkle-50 border border-periwinkle-200 rounded-lg"
                      title="Editar profissional"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(professional.id, professional.name)}
                      className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg"
                      title="Excluir profissional"
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
      {professionals.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-jet-black-900">{professionals.length}</p>
              <p className="text-sm text-jet-black-600">Total de Profissionais</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {professionals.filter(p => p.active).length}
              </p>
              <p className="text-sm text-jet-black-600">Profissionais Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-periwinkle-600">
                {professionals.reduce((acc, prof) => acc + (prof.services ? prof.services.length : 0), 0)}
              </p>
              <p className="text-sm text-jet-black-600">Total de Serviços Oferecidos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}