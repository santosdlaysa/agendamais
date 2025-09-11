import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X, User } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ClientForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEditMode) {
      fetchClient()
    }
  }, [id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/clients/${id}`)
      const client = response.data.client
      
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        notes: client.notes || ''
      })
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
      toast.error('Erro ao carregar cliente')
      navigate('/clients')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    console.log('=== DEBUG: validateForm iniciado ===')
    console.log('formData atual:', formData)
    
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
      console.log('Erro: Nome é obrigatório')
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido'
      console.log('Erro: Email inválido:', formData.email)
    }

    if (formData.phone && !/^[\d\s\(\)\-\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Telefone deve conter apenas números e símbolos válidos'
      console.log('Erro: Telefone inválido:', formData.phone)
    }

    console.log('Erros encontrados:', newErrors)
    console.log('Validação passou:', Object.keys(newErrors).length === 0)
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('=== DEBUG: ClientForm handleSubmit iniciado ===')
    console.log('Dados do formulário:', formData)
    console.log('Modo de edição:', isEditMode)
    
    if (!validateForm()) {
      console.log('Validação falhou!')
      return
    }

    try {
      setLoading(true)
      
      const submitData = {
        ...formData,
        phone: formData.phone || null,
        email: formData.email || null,
        notes: formData.notes || null
      }

      console.log('Dados que serão enviados:', submitData)

      if (isEditMode) {
        console.log('Fazendo PUT para:', `/clients/${id}`)
        const response = await api.put(`/clients/${id}`, submitData)
        console.log('Resposta PUT:', response)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        console.log('Fazendo POST para: /clients')
        const response = await api.post('/clients', submitData)
        console.log('Resposta POST:', response)
        toast.success('Cliente criado com sucesso!')
      }
      
      console.log('Navegando para /clients')
      navigate('/clients')
    } catch (error) {
      console.error('=== ERRO ao salvar cliente ===')
      console.error('Erro completo:', error)
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
      console.error('Response headers:', error.response?.headers)
      const message = error.response?.data?.message || 'Erro ao salvar cliente'
      toast.error(message)
    } finally {
      setLoading(false)
      console.log('=== DEBUG: handleSubmit finalizado ===')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('=== DEBUG: handleInputChange ===')
    console.log('Campo:', name, 'Valor:', value)
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      }
      console.log('formData atualizado:', newData)
      return newData
    })
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  if (loading && isEditMode) {
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
            </h1>
            <p className="text-gray-600">
              {isEditMode ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? 'Informações do Cliente' : 'Novo Cliente'}
              </h3>
              <p className="text-sm text-gray-600">
                {isEditMode ? 'Atualize os dados conforme necessário' : 'Preencha as informações básicas'}
              </p>
            </div>
          </div>

          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Maria Silva"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Usado para contato e lembretes de agendamento
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="maria@exemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Usado para confirmações e comunicações
                </p>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas e Observações
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Preferências, alergias, histórico, ou qualquer informação relevante sobre o cliente..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Informações importantes que podem ajudar no atendimento
              </p>
            </div>
          </div>

          {/* Informações Adicionais */}
          {isEditMode && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Sistema</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Cliente desde:</span>
                    <p>Esta informação será exibida após salvar</p>
                  </div>
                  <div>
                    <span className="font-medium">Agendamentos:</span>
                    <p>Histórico aparecerá na lista de clientes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/clients')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')} Cliente
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      {!isEditMode && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Dicas para cadastro</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Apenas o nome é obrigatório</li>
            <li>• Telefone e email facilitam o contato</li>
            <li>• Use as observações para preferências especiais</li>
            <li>• Você pode editar essas informações depois</li>
          </ul>
        </div>
      )}
    </div>
  )
}