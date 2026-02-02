import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  Building2,
  Scissors,
  Users,
  Clock,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  X,
  Rocket,
  Copy,
  ExternalLink,
  Stethoscope,
  Dumbbell,
  Heart,
  PawPrint,
  Car,
  Palette,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Star,
  Zap,
  Globe
} from 'lucide-react'
import { useOnboarding } from '../contexts/OnboardingContext'
import api from '../utils/api'
import toast from 'react-hot-toast'

const DAYS_PT = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

const BUSINESS_TYPES = [
  { id: 'salon', name: 'Salão de Beleza', icon: Scissors, color: 'pink', services: ['Corte Feminino', 'Corte Masculino', 'Escova', 'Coloração', 'Hidratação'], roles: ['Cabeleireira', 'Cabeleireiro', 'Colorista', 'Manicure', 'Assistente'] },
  { id: 'barber', name: 'Barbearia', icon: Scissors, color: 'blue', services: ['Corte', 'Barba', 'Corte + Barba', 'Pigmentação', 'Hidratação'], roles: ['Barbeiro', 'Barbeiro Chefe', 'Auxiliar'] },
  { id: 'clinic', name: 'Clínica/Consultório', icon: Stethoscope, color: 'green', services: ['Consulta', 'Retorno', 'Exame', 'Procedimento'], roles: ['Médico(a)', 'Enfermeiro(a)', 'Dentista', 'Fisioterapeuta', 'Nutricionista', 'Psicólogo(a)'] },
  { id: 'aesthetic', name: 'Estética', icon: Sparkles, color: 'purple', services: ['Limpeza de Pele', 'Peeling', 'Massagem Facial', 'Drenagem'], roles: ['Esteticista', 'Dermatologista', 'Biomédica', 'Designer de Sobrancelhas'] },
  { id: 'fitness', name: 'Personal/Academia', icon: Dumbbell, color: 'orange', services: ['Avaliação Física', 'Treino Personal', 'Aula Experimental'], roles: ['Personal Trainer', 'Educador Físico', 'Instrutor', 'Nutricionista Esportivo'] },
  { id: 'spa', name: 'Spa/Massagem', icon: Heart, color: 'rose', services: ['Massagem Relaxante', 'Massagem Terapêutica', 'Day Spa', 'Reflexologia'], roles: ['Massoterapeuta', 'Terapeuta', 'Massagista', 'Quiropraxista'] },
  { id: 'pet', name: 'Pet Shop/Vet', icon: PawPrint, color: 'amber', services: ['Banho', 'Tosa', 'Banho + Tosa', 'Consulta Veterinária'], roles: ['Veterinário(a)', 'Tosador(a)', 'Banhista', 'Auxiliar Veterinário'] },
  { id: 'auto', name: 'Automotivo', icon: Car, color: 'slate', services: ['Lavagem Simples', 'Lavagem Completa', 'Polimento', 'Higienização'], roles: ['Lavador', 'Polidor', 'Detalhista', 'Gerente'] },
  { id: 'tattoo', name: 'Tatuagem/Piercing', icon: Palette, color: 'indigo', services: ['Tatuagem Pequena', 'Tatuagem Média', 'Piercing', 'Cover Up'], roles: ['Tatuador(a)', 'Body Piercer', 'Artista'] },
  { id: 'education', name: 'Aulas/Cursos', icon: GraduationCap, color: 'cyan', services: ['Aula Individual', 'Aula em Grupo', 'Workshop'], roles: ['Professor(a)', 'Instrutor(a)', 'Tutor(a)', 'Mentor(a)'] },
  { id: 'consulting', name: 'Consultoria', icon: Briefcase, color: 'emerald', services: ['Consultoria 1h', 'Consultoria 2h', 'Mentoria'], roles: ['Consultor(a)', 'Especialista', 'Analista', 'Coach'] },
  { id: 'other', name: 'Outro', icon: Building2, color: 'gray', services: ['Serviço 1', 'Serviço 2'], roles: ['Profissional', 'Atendente', 'Especialista'] }
]

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h 30min' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' }
]

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const {
    currentStep,
    steps,
    onboardingData,
    nextStep,
    prevStep,
    updateOnboardingData,
    completeOnboarding,
    skipOnboarding
  } = useOnboarding()

  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [slugAvailable, setSlugAvailable] = useState(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [selectedBusinessType, setSelectedBusinessType] = useState(null)
  const [services, setServices] = useState([{ name: '', duration: 30, price: '' }])
  const [showConfetti, setShowConfetti] = useState(false)

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Verificar disponibilidade do slug
  useEffect(() => {
    const checkSlug = async () => {
      const slug = onboardingData.business.slug
      if (!slug || slug.length < 3) {
        setSlugAvailable(null)
        return
      }

      setCheckingSlug(true)
      try {
        // Tentar buscar o negócio pelo slug
        const response = await api.get(`/public/business/${slug}`).catch(() => null)
        // Se encontrou, slug não está disponível (a menos que seja o próprio negócio)
        setSlugAvailable(!response)
      } catch {
        setSlugAvailable(true)
      } finally {
        setCheckingSlug(false)
      }
    }

    const timer = setTimeout(checkSlug, 500)
    return () => clearTimeout(timer)
  }, [onboardingData.business.slug])

  // Quando selecionar tipo de negócio, sugerir serviços
  useEffect(() => {
    if (selectedBusinessType) {
      const businessType = BUSINESS_TYPES.find(b => b.id === selectedBusinessType)
      if (businessType && businessType.services.length > 0) {
        const suggestedServices = businessType.services.slice(0, 3).map((name, idx) => ({
          name,
          duration: 30 + (idx * 15),
          price: ''
        }))
        setServices(suggestedServices)
      }
    }
  }, [selectedBusinessType])

  // Validações
  const validateBusiness = () => {
    const errs = {}
    if (!onboardingData.business.business_name.trim()) {
      errs.business_name = 'Nome da empresa é obrigatório'
    }
    if (!onboardingData.business.slug.trim()) {
      errs.slug = 'Slug é obrigatório'
    } else if (onboardingData.business.slug.length < 3) {
      errs.slug = 'Slug deve ter pelo menos 3 caracteres'
    } else if (slugAvailable === false) {
      errs.slug = 'Este slug já está em uso'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateServices = () => {
    const validServices = services.filter(s => s.name.trim())
    if (validServices.length === 0) {
      setErrors({ services: 'Adicione pelo menos um serviço' })
      return false
    }
    const hasInvalidPrice = validServices.some(s => !s.price || parseFloat(s.price) <= 0)
    if (hasInvalidPrice) {
      setErrors({ services: 'Todos os serviços precisam ter um preço válido' })
      return false
    }
    setErrors({})
    return true
  }

  const validateProfessional = () => {
    const errs = {}
    if (!onboardingData.professional.name.trim()) {
      errs.professional_name = 'Nome do profissional é obrigatório'
    }
    if (!onboardingData.professional.role.trim()) {
      errs.professional_role = 'Função/cargo é obrigatório'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Salvar dados
  const saveBusiness = async () => {
    if (!validateBusiness()) return false

    setSaving(true)
    try {
      await api.put('/auth/business', {
        business_name: onboardingData.business.business_name,
        slug: onboardingData.business.slug,
        business_phone: onboardingData.business.business_phone,
        business_address: onboardingData.business.business_address,
        online_booking_enabled: true
      })
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar dados da empresa'
      toast.error(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveServices = async () => {
    if (!validateServices()) return false

    setSaving(true)
    try {
      const validServices = services.filter(s => s.name.trim())
      for (const service of validServices) {
        await api.post('/services', {
          name: service.name,
          duration: parseInt(service.duration),
          price: parseFloat(service.price),
          active: true
        })
      }
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar serviços'
      toast.error(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveProfessional = async () => {
    if (!validateProfessional()) return false

    setSaving(true)
    try {
      const servicesRes = await api.get('/services')
      const servicesList = servicesRes.data.services || []
      const serviceIds = servicesList.map(s => s.id)

      await api.post('/professionals', {
        name: onboardingData.professional.name,
        role: onboardingData.professional.role,
        email: onboardingData.professional.email || null,
        phone: onboardingData.professional.phone || null,
        service_ids: serviceIds,
        active: true
      })
      return true
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar profissional'
      toast.error(message)
      return false
    } finally {
      setSaving(false)
    }
  }

  const saveSchedule = async () => {
    setSaving(true)
    try {
      const professionalsRes = await api.get('/professionals')
      const professionals = professionalsRes.data.professionals || []

      if (professionals.length > 0) {
        const professional = professionals[0]
        const workingHours = Object.entries(onboardingData.schedule)
          .filter(([_, config]) => config.enabled)
          .map(([day, config]) => ({
            day_of_week: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day),
            start_time: config.start,
            end_time: config.end
          }))

        await api.put(`/professionals/${professional.id}`, {
          ...professional,
          working_hours: workingHours
        })
      }
      return true
    } catch (error) {
      console.error('Erro ao salvar horários:', error)
      return true
    } finally {
      setSaving(false)
    }
  }

  // Handlers de navegação
  const handleNext = async () => {
    let success = true

    switch (steps[currentStep].id) {
      case 'business':
        success = await saveBusiness()
        break
      case 'services':
        success = await saveServices()
        break
      case 'professionals':
        success = await saveProfessional()
        break
      case 'schedule':
        success = await saveSchedule()
        if (success) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
        break
    }

    if (success) {
      nextStep()
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    toast.success('Configuração concluída! Bem-vindo ao Agendar Mais!')
    navigate('/dashboard')
  }

  const handleSkip = () => {
    skipOnboarding()
    navigate('/dashboard')
  }

  // Adicionar/remover serviços
  const addService = () => {
    setServices([...services, { name: '', duration: 30, price: '' }])
  }

  const removeService = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index))
    }
  }

  const updateService = (index, field, value) => {
    const newServices = [...services]
    newServices[index] = { ...newServices[index], [field]: value }
    setServices(newServices)
  }

  const getBookingUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/agendar/${onboardingData.business.slug || 'seu-negocio'}`
  }

  const copyBookingLink = () => {
    navigator.clipboard.writeText(getBookingUrl())
    toast.success('Link copiado!')
  }

  // Renderizar passo atual
  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <WelcomeStep
            onNext={nextStep}
            onSkip={handleSkip}
            selectedType={selectedBusinessType}
            onSelectType={setSelectedBusinessType}
          />
        )
      case 'business':
        return (
          <BusinessStep
            data={onboardingData.business}
            onChange={(data) => updateOnboardingData('business', data)}
            errors={errors}
            generateSlug={generateSlug}
            slugAvailable={slugAvailable}
            checkingSlug={checkingSlug}
            getBookingUrl={getBookingUrl}
            copyBookingLink={copyBookingLink}
          />
        )
      case 'services':
        return (
          <ServicesStep
            services={services}
            onAddService={addService}
            onRemoveService={removeService}
            onUpdateService={updateService}
            errors={errors}
            businessType={selectedBusinessType}
          />
        )
      case 'professionals':
        return (
          <ProfessionalStep
            data={onboardingData.professional}
            onChange={(data) => updateOnboardingData('professional', data)}
            errors={errors}
            services={services.filter(s => s.name.trim())}
            businessType={selectedBusinessType}
          />
        )
      case 'schedule':
        return (
          <ScheduleStep
            data={onboardingData.schedule}
            onChange={(data) => updateOnboardingData('schedule', data)}
          />
        )
      case 'complete':
        return (
          <CompleteStep
            onComplete={handleComplete}
            businessName={onboardingData.business.business_name}
            bookingUrl={getBookingUrl()}
            copyBookingLink={copyBookingLink}
            showConfetti={showConfetti}
          />
        )
      default:
        return null
    }
  }

  const progressPercentage = Math.round(((currentStep) / (steps.length - 1)) * 100)

  return (
    <div className="fixed inset-0 bg-jet-black-50 z-50 overflow-y-auto">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        {/* Header Fixo */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-jet-black-100 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-periwinkle-500 to-periwinkle-600 rounded-xl flex items-center justify-center shadow-lg shadow-periwinkle-500/30">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-jet-black-900">Agendar Mais</span>
                  <p className="text-xs text-jet-black-500">Configuração Inicial</p>
                </div>
              </div>
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className="text-jet-black-400 hover:text-jet-black-600 flex items-center gap-1 text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Pular configuração
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="bg-white border-b border-jet-black-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-jet-black-600">
                  Passo {currentStep} de {steps.length - 2}
                </span>
                <span className="text-sm font-medium text-periwinkle-600">
                  {progressPercentage}% completo
                </span>
              </div>
              <div className="h-2 bg-jet-black-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-periwinkle-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-3">
                {steps.slice(1, -1).map((step, idx) => {
                  const stepIndex = idx + 1
                  const isActive = stepIndex === currentStep
                  const isCompleted = stepIndex < currentStep

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-periwinkle-600 text-white ring-4 ring-periwinkle-100'
                            : 'bg-jet-black-200 text-jet-black-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`mt-1 text-xs font-medium hidden sm:block ${
                        isActive ? 'text-periwinkle-600' : isCompleted ? 'text-green-600' : 'text-jet-black-400'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Content - Full Width */}
        <div className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-jet-black-200/50 border border-jet-black-100 p-6 sm:p-8 lg:p-10 transition-all">
              {renderStep()}

              {/* Navigation Buttons */}
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-jet-black-100">
                  <button
                    onClick={prevStep}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2.5 text-jet-black-500 hover:text-jet-black-700 hover:bg-jet-black-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-periwinkle-600 to-periwinkle-700 hover:from-periwinkle-700 hover:to-periwinkle-800 text-white rounded-xl font-semibold transition-all shadow-lg shadow-periwinkle-500/30 hover:shadow-xl hover:shadow-periwinkle-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for confetti */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          width: 10px;
          height: 10px;
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

// ============ COMPONENTES DOS PASSOS ============

function WelcomeStep({ onNext, onSkip, selectedType, onSelectType }) {
  return (
    <div className="py-4">
      {/* Header com botão */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-periwinkle-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 flex-shrink-0">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jet-black-900 mb-2">
              Bem-vindo ao Agendar Mais!
            </h1>
            <p className="text-jet-black-600 text-lg">
              Vamos configurar tudo em menos de 5 minutos. Escolha seu tipo de negócio:
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onSkip}
            className="text-jet-black-400 hover:text-jet-black-600 text-sm transition-colors whitespace-nowrap"
          >
            Configurar depois
          </button>
          <button
            onClick={onNext}
            disabled={!selectedType}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedType
                ? 'bg-gradient-to-r from-periwinkle-600 to-periwinkle-700 hover:from-periwinkle-700 hover:to-periwinkle-800 text-white shadow-lg shadow-periwinkle-500/30'
                : 'bg-jet-black-100 text-jet-black-400 cursor-not-allowed'
            }`}
          >
            Começar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Business Type Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
        {BUSINESS_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id

          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type.id)}
              className={`p-4 lg:p-5 rounded-xl border-2 transition-all text-left group ${
                isSelected
                  ? 'border-periwinkle-500 bg-periwinkle-50 shadow-lg shadow-periwinkle-500/20'
                  : 'border-jet-black-100 hover:border-periwinkle-200 hover:bg-jet-black-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all ${
                isSelected
                  ? 'bg-periwinkle-500 text-white'
                  : 'bg-jet-black-100 text-jet-black-500 group-hover:bg-periwinkle-100 group-hover:text-periwinkle-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className={`font-medium ${isSelected ? 'text-periwinkle-700' : 'text-jet-black-700'}`}>
                {type.name}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BusinessStep({ data, onChange, errors, generateSlug, slugAvailable, checkingSlug, getBookingUrl, copyBookingLink }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-periwinkle-500 to-periwinkle-600 rounded-xl flex items-center justify-center shadow-lg shadow-periwinkle-500/25">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-jet-black-900">Dados da Empresa</h2>
          <p className="text-jet-black-500">Informações que seus clientes verão</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Coluna Esquerda */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Nome da Empresa *
            </label>
            <input
              type="text"
              value={data.business_name}
              onChange={(e) => {
                onChange({
                  business_name: e.target.value,
                  slug: data.slug || generateSlug(e.target.value)
                })
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 transition-colors ${
                errors.business_name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-jet-black-200 focus:border-periwinkle-500'
              }`}
              placeholder="Ex: Salão da Maria, Barbearia Premium..."
            />
            {errors.business_name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.business_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Link de Agendamento *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-xl border-2 border-r-0 border-jet-black-200 bg-jet-black-50 text-jet-black-500 text-sm">
                /agendar/
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={data.slug}
                  onChange={(e) => onChange({ slug: generateSlug(e.target.value) })}
                  className={`w-full px-4 py-3 border-2 rounded-r-xl focus:ring-0 pr-10 transition-colors ${
                    errors.slug
                      ? 'border-red-300 focus:border-red-500'
                      : slugAvailable === true
                      ? 'border-green-300 focus:border-green-500'
                      : 'border-jet-black-200 focus:border-periwinkle-500'
                  }`}
                  placeholder="minha-empresa"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {checkingSlug ? (
                    <Loader2 className="w-5 h-5 text-jet-black-400 animate-spin" />
                  ) : slugAvailable === true ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : slugAvailable === false ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : null}
                </div>
              </div>
            </div>
            {errors.slug ? (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.slug}
              </p>
            ) : slugAvailable === true && data.slug.length >= 3 ? (
              <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Este link está disponível!
              </p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Telefone / WhatsApp
            </label>
            <input
              type="tel"
              value={data.business_phone}
              onChange={(e) => onChange({ business_phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={data.business_address}
              onChange={(e) => onChange({ business_address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
              placeholder="Rua, número, bairro"
            />
          </div>
        </div>

        {/* Coluna Direita - Preview */}
        <div className="space-y-5">
          {data.slug && data.slug.length >= 3 && slugAvailable ? (
            <div className="bg-gradient-to-br from-periwinkle-50 to-purple-50 rounded-2xl p-6 border border-periwinkle-100 h-full">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-periwinkle-600" />
                <span className="font-semibold text-jet-black-900">Preview do seu link</span>
              </div>
              <div className="bg-white rounded-xl p-4 border border-periwinkle-100 mb-4">
                <code className="text-sm text-jet-black-700 break-all">
                  {getBookingUrl()}
                </code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyBookingLink}
                  className="flex-1 py-2.5 bg-white border border-periwinkle-200 rounded-lg hover:bg-periwinkle-50 transition-colors flex items-center justify-center gap-2 text-periwinkle-600 font-medium"
                >
                  <Copy className="w-4 h-4" />
                  Copiar Link
                </button>
                <a
                  href={getBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-jet-black-500 mt-4">
                Este é o link que você vai compartilhar com seus clientes para eles agendarem online.
              </p>
            </div>
          ) : (
            <div className="bg-jet-black-50 rounded-2xl p-6 border-2 border-dashed border-jet-black-200 h-full flex flex-col items-center justify-center text-center">
              <Globe className="w-12 h-12 text-jet-black-300 mb-3" />
              <p className="text-jet-black-500 font-medium">Preview do Link</p>
              <p className="text-sm text-jet-black-400 mt-1">
                Preencha o nome da empresa para ver como ficará seu link de agendamento
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ServicesStep({ services, onAddService, onRemoveService, onUpdateService, errors, businessType }) {
  const businessInfo = BUSINESS_TYPES.find(b => b.id === businessType)

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-jet-black-900">Seus Serviços</h2>
            <p className="text-jet-black-500">Adicione os serviços que você oferece</p>
          </div>
        </div>

        {businessInfo && (
          <div className="bg-periwinkle-50 border border-periwinkle-100 rounded-xl px-4 py-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-periwinkle-600" />
            <span className="text-sm text-periwinkle-700">Sugestões para <strong>{businessInfo.name}</strong></span>
          </div>
        )}
      </div>

      {errors.services && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{errors.services}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-jet-black-50 rounded-xl p-5 border border-jet-black-100 hover:border-jet-black-200 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-jet-black-600">Serviço {index + 1}</span>
              {services.length > 1 && (
                <button
                  onClick={() => onRemoveService(index)}
                  className="p-1.5 text-jet-black-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={service.name}
                onChange={(e) => onUpdateService(index, 'name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
                placeholder="Nome do serviço"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={service.duration}
                  onChange={(e) => onUpdateService(index, 'duration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors bg-white"
                >
                  {DURATION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-jet-black-400">R$</span>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => onUpdateService(index, 'price', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={onAddService}
          className="h-full min-h-[180px] border-2 border-dashed border-jet-black-200 rounded-xl text-jet-black-400 hover:border-periwinkle-300 hover:text-periwinkle-600 hover:bg-periwinkle-50/50 transition-all flex flex-col items-center justify-center gap-2"
        >
          <Plus className="w-8 h-8" />
          <span className="font-medium">Adicionar Serviço</span>
        </button>
      </div>
    </div>
  )
}

function ProfessionalStep({ data, onChange, errors, services, businessType }) {
  const businessTypeData = BUSINESS_TYPES.find(b => b.id === businessType)
  const suggestedRoles = businessTypeData?.roles || ['Profissional', 'Atendente', 'Especialista']

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-jet-black-900">Primeiro Profissional</h2>
          <p className="text-jet-black-500">Pode ser voce ou um membro da equipe</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Coluna Esquerda - Formulário */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Nome do Profissional *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 transition-colors ${
                errors.professional_name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-jet-black-200 focus:border-periwinkle-500'
              }`}
              placeholder="Ex: Maria Silva, João Santos..."
            />
            {errors.professional_name && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.professional_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Funcao/Cargo *
            </label>
            <input
              type="text"
              value={data.role}
              onChange={(e) => onChange({ role: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-0 transition-colors ${
                errors.professional_role
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-jet-black-200 focus:border-periwinkle-500'
              }`}
              placeholder="Ex: Cabeleireira, Barbeiro, Esteticista..."
            />
            {errors.professional_role && (
              <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.professional_role}
              </p>
            )}
            {/* Sugestoes de funcao */}
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestedRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => onChange({ role })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    data.role === role
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-jet-black-50 border-jet-black-200 text-jet-black-600 hover:bg-purple-50 hover:border-purple-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Email <span className="text-jet-black-400">(opcional)</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-2">
              Telefone <span className="text-jet-black-400">(opcional)</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-jet-black-200 rounded-xl focus:border-periwinkle-500 focus:ring-0 transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        {/* Coluna Direita - Info dos serviços */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-jet-black-900">Serviços associados</span>
          </div>
          <p className="text-sm text-purple-700 mb-4">
            Este profissional poderá atender os seguintes serviços:
          </p>
          <div className="flex flex-wrap gap-2">
            {services.map((s, i) => (
              <span key={i} className="bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                {s.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-purple-600 mt-4">
            Você pode adicionar mais profissionais e ajustar os serviços depois.
          </p>
        </div>
      </div>
    </div>
  )
}

function ScheduleStep({ data, onChange }) {
  const toggleDay = (day) => {
    onChange({
      [day]: { ...data[day], enabled: !data[day].enabled }
    })
  }

  const updateTime = (day, field, value) => {
    onChange({
      [day]: { ...data[day], [field]: value }
    })
  }

  const applyToAll = (startTime, endTime) => {
    const updates = {}
    Object.keys(DAYS_PT).forEach(day => {
      if (data[day].enabled) {
        updates[day] = { ...data[day], start: startTime, end: endTime }
      }
    })
    onChange(updates)
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-jet-black-900">Horário de Funcionamento</h2>
            <p className="text-jet-black-500">Quando você atende seus clientes</p>
          </div>
        </div>

        {/* Quick apply */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-jet-black-500">Aplicar:</span>
          <button
            onClick={() => applyToAll('09:00', '18:00')}
            className="text-sm bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium"
          >
            09h - 18h
          </button>
          <button
            onClick={() => applyToAll('08:00', '17:00')}
            className="text-sm bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium"
          >
            08h - 17h
          </button>
          <button
            onClick={() => applyToAll('10:00', '20:00')}
            className="text-sm bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors font-medium"
          >
            10h - 20h
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {Object.entries(DAYS_PT).map(([day, label]) => (
          <div
            key={day}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              data[day].enabled
                ? 'bg-white border-jet-black-200'
                : 'bg-jet-black-50 border-jet-black-100'
            }`}
          >
            <label className="flex items-center gap-3 cursor-pointer min-w-[130px]">
              <input
                type="checkbox"
                checked={data[day].enabled}
                onChange={() => toggleDay(day)}
                className="w-5 h-5 rounded border-jet-black-300 text-periwinkle-600 focus:ring-periwinkle-500"
              />
              <span className={`font-medium ${data[day].enabled ? 'text-jet-black-900' : 'text-jet-black-400'}`}>
                {label}
              </span>
            </label>

            {data[day].enabled && (
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  type="time"
                  value={data[day].start}
                  onChange={(e) => updateTime(day, 'start', e.target.value)}
                  className="px-3 py-2 border-2 border-jet-black-200 rounded-lg focus:ring-0 focus:border-periwinkle-500 transition-colors"
                />
                <span className="text-jet-black-400">às</span>
                <input
                  type="time"
                  value={data[day].end}
                  onChange={(e) => updateTime(day, 'end', e.target.value)}
                  className="px-3 py-2 border-2 border-jet-black-200 rounded-lg focus:ring-0 focus:border-periwinkle-500 transition-colors"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CompleteStep({ onComplete, businessName, bookingUrl, copyBookingLink, showConfetti }) {
  return (
    <div className="py-6">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Coluna Esquerda - Mensagem de sucesso */}
        <div className="text-center lg:text-left">
          <div className={`w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 mx-auto lg:mx-0 ${showConfetti ? 'animate-bounce' : ''}`}>
            <Check className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jet-black-900 mb-3">
            Tudo pronto!
          </h1>
          <p className="text-jet-black-600 text-lg mb-6">
            <strong className="text-jet-black-900">{businessName}</strong> está configurado e pronto para receber agendamentos online!
          </p>

          {/* Link de Agendamento */}
          <div className="bg-gradient-to-r from-periwinkle-50 to-purple-50 rounded-2xl p-5 border border-periwinkle-100 text-left mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-periwinkle-600" />
              <span className="font-semibold text-jet-black-900">Seu link de agendamento</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-white px-4 py-3 rounded-xl border border-periwinkle-100 text-jet-black-700 truncate">
                {bookingUrl}
              </code>
              <button
                onClick={copyBookingLink}
                className="p-3 bg-periwinkle-600 text-white rounded-xl hover:bg-periwinkle-700 transition-colors shadow-lg shadow-periwinkle-500/30"
              >
                <Copy className="w-5 h-5" />
              </button>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white border border-periwinkle-200 rounded-xl hover:bg-periwinkle-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-periwinkle-600" />
              </a>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-periwinkle-600 to-periwinkle-700 hover:from-periwinkle-700 hover:to-periwinkle-800 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-periwinkle-500/30 hover:shadow-2xl flex items-center justify-center gap-2"
          >
            Ir para o Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Coluna Direita - Próximos passos */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 lg:p-8">
          <h3 className="font-semibold text-green-800 mb-6 flex items-center gap-2 text-lg">
            <Sparkles className="w-6 h-6" />
            Próximos passos
          </h3>
          <ul className="space-y-4">
            {[
              { text: 'Compartilhe o link no WhatsApp e Instagram', desc: 'Divulgue para seus clientes agendarem online' },
              { text: 'Adicione mais serviços e profissionais', desc: 'Complete seu catálogo de serviços' },
              { text: 'Configure lembretes automáticos', desc: 'Reduza faltas com notificações por WhatsApp' },
              { text: 'Escolha um plano para desbloquear recursos', desc: 'Acesse relatórios, múltiplos profissionais e mais' }
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">{item.text}</p>
                  <p className="text-sm text-green-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
