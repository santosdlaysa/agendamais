import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  X,
  Scissors,
  Sparkles,
  Heart,
  Star,
  Zap,
  Droplet,
  Sun,
  Moon,
  Flower2,
  Gem,
  Crown,
  Brush,
  Palette,
  Dumbbell,
  HandMetal,
  Eye,
  Smile,
  Coffee,
  Leaf,
  Waves,
  Wind,
  Bath,
  Baby,
  Dog,
  Cat,
  Car,
  Home,
  Wrench,
  Settings,
  Camera
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

// Lista de ícones disponíveis para serviços
const AVAILABLE_ICONS = [
  { name: 'scissors', icon: Scissors, label: 'Tesoura' },
  { name: 'sparkles', icon: Sparkles, label: 'Brilho' },
  { name: 'heart', icon: Heart, label: 'Coração' },
  { name: 'star', icon: Star, label: 'Estrela' },
  { name: 'zap', icon: Zap, label: 'Raio' },
  { name: 'droplet', icon: Droplet, label: 'Gota' },
  { name: 'sun', icon: Sun, label: 'Sol' },
  { name: 'moon', icon: Moon, label: 'Lua' },
  { name: 'flower', icon: Flower2, label: 'Flor' },
  { name: 'gem', icon: Gem, label: 'Diamante' },
  { name: 'crown', icon: Crown, label: 'Coroa' },
  { name: 'brush', icon: Brush, label: 'Pincel' },
  { name: 'palette', icon: Palette, label: 'Paleta' },
  { name: 'dumbbell', icon: Dumbbell, label: 'Haltere' },
  { name: 'hand', icon: HandMetal, label: 'Mão' },
  { name: 'eye', icon: Eye, label: 'Olho' },
  { name: 'smile', icon: Smile, label: 'Sorriso' },
  { name: 'coffee', icon: Coffee, label: 'Café' },
  { name: 'leaf', icon: Leaf, label: 'Folha' },
  { name: 'waves', icon: Waves, label: 'Ondas' },
  { name: 'wind', icon: Wind, label: 'Vento' },
  { name: 'bath', icon: Bath, label: 'Banho' },
  { name: 'baby', icon: Baby, label: 'Bebê' },
  { name: 'dog', icon: Dog, label: 'Cachorro' },
  { name: 'cat', icon: Cat, label: 'Gato' },
  { name: 'car', icon: Car, label: 'Carro' },
  { name: 'home', icon: Home, label: 'Casa' },
  { name: 'wrench', icon: Wrench, label: 'Ferramenta' },
  { name: 'settings', icon: Settings, label: 'Config.' },
  { name: 'camera', icon: Camera, label: 'Câmera' },
]

// Função para obter o componente do ícone pelo nome
export const getServiceIcon = (iconName) => {
  const found = AVAILABLE_ICONS.find(i => i.name === iconName)
  return found ? found.icon : Sparkles
}

export default function ServiceForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id
  
  const [loading, setLoading] = useState(false)
  const [professionals, setProfessionals] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    active: true,
    professional_ids: [],
    icon: 'sparkles'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchProfessionals()
    if (isEditMode) {
      fetchService()
    }
  }, [id])

  const fetchProfessionals = async () => {
    try {
      const response = await api.get('/professionals')
      setProfessionals(response.data.professionals || [])
    } catch (error) {
      toast.error('Erro ao carregar profissionais')
    }
  }

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/services/${id}`)
      const service = response.data.service
      
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        active: service.active !== false,
        professional_ids: service.professionals ? service.professionals.map(p => p.id) : [],
        icon: service.icon || 'sparkles'
      })
    } catch (error) {
      toast.error('Erro ao carregar serviço')
      navigate('/services')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Preço deve ser maior que zero'
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duração deve ser maior que zero'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration)
      }

      if (isEditMode) {
        await api.put(`/services/${id}`, submitData)
        toast.success('Serviço atualizado com sucesso!')
      } else {
        await api.post('/services', submitData)
        toast.success('Serviço criado com sucesso!')
      }
      
      navigate('/services')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao salvar serviço'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleProfessionalChange = (professionalId) => {
    setFormData(prev => ({
      ...prev,
      professional_ids: prev.professional_ids.includes(professionalId)
        ? prev.professional_ids.filter(id => id !== professionalId)
        : [...prev.professional_ids, professionalId]
    }))
  }

  if (loading && isEditMode) {
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
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-jet-black-300 hover:bg-jet-black-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-jet-black-900">
              {isEditMode ? 'Editar Serviço' : 'Novo Serviço'}
            </h1>
            <p className="text-jet-black-600">
              {isEditMode ? 'Atualize as informações do serviço' : 'Preencha os dados do novo serviço'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 ${
                    errors.name ? 'border-red-500' : 'border-jet-black-300'
                  }`}
                  placeholder="Ex: Corte de cabelo"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 ${
                    errors.price ? 'border-red-500' : 'border-jet-black-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Duração (minutos) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className={`w-full md:w-1/3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500 ${
                  errors.duration ? 'border-red-500' : 'border-jet-black-300'
                }`}
                placeholder="60"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                placeholder="Descreva os detalhes do serviço..."
              />
            </div>
          </div>

          {/* Ícone */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Ícone do Serviço</h3>
            <p className="text-sm text-jet-black-600 mb-4">
              Escolha um ícone para identificar visualmente o serviço:
            </p>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {AVAILABLE_ICONS.map((iconItem) => {
                const IconComponent = iconItem.icon
                return (
                  <button
                    key={iconItem.name}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon: iconItem.name }))}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      formData.icon === iconItem.name
                        ? 'border-periwinkle-500 bg-periwinkle-50 text-periwinkle-700'
                        : 'border-jet-black-200 hover:border-jet-black-300 text-jet-black-600'
                    }`}
                    title={iconItem.label}
                  >
                    <IconComponent className="w-6 h-6" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Profissionais */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Profissionais</h3>
            <p className="text-sm text-jet-black-600 mb-4">
              Selecione os profissionais que podem realizar este serviço:
            </p>
            
            {professionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professionals.map((professional) => (
                  <div key={professional.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-jet-black-50">
                    <input
                      type="checkbox"
                      id={`professional-${professional.id}`}
                      checked={formData.professional_ids.includes(professional.id)}
                      onChange={() => handleProfessionalChange(professional.id)}
                      className="h-4 w-4 text-periwinkle-600 border-jet-black-300 rounded focus:ring-periwinkle-500"
                    />
                    <label htmlFor={`professional-${professional.id}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium text-jet-black-900">{professional.name}</div>
                      {professional.specialty && (
                        <div className="text-xs text-jet-black-500">{professional.specialty}</div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-jet-black-500 text-center py-8">
                Nenhum profissional cadastrado. 
                <button
                  type="button"
                  onClick={() => navigate('/professionals/new')}
                  className="text-periwinkle-600 hover:text-periwinkle-800 ml-1"
                >
                  Cadastre o primeiro profissional
                </button>
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-jet-black-900 mb-4">Status</h3>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-periwinkle-600 border-jet-black-300 rounded focus:ring-periwinkle-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-jet-black-700">
                Serviço ativo
              </label>
            </div>
            <p className="text-xs text-jet-black-500 mt-1">
              Serviços inativos não aparecem para agendamento
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="flex items-center px-4 py-2 border border-jet-black-300 rounded-lg text-jet-black-700 hover:bg-jet-black-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar')} Serviço
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}