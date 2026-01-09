import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import bookingService from '../../services/publicApi'
import BookingSteps from '../../components/booking/BookingSteps'
import BusinessHeader from '../../components/booking/BusinessHeader'
import ServiceSelector from '../../components/booking/ServiceSelector'
import ProfessionalSelector from '../../components/booking/ProfessionalSelector'
import DateTimePicker from '../../components/booking/DateTimePicker'
import BookingClientForm from '../../components/booking/BookingClientForm'
import BookingSummary from '../../components/booking/BookingSummary'

export default function BookingPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // Estado do passo atual
  const [step, setStep] = useState(1)

  // Estados de loading
  const [loadingBusiness, setLoadingBusiness] = useState(true)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingProfessionals, setLoadingProfessionals] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Estados de dados
  const [business, setBusiness] = useState(null)
  const [services, setServices] = useState([])
  const [professionals, setProfessionals] = useState([])
  const [availability, setAvailability] = useState({})

  // Estados de seleção
  const [selectedService, setSelectedService] = useState(null)
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })

  // Estados de erro
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})

  // Carregar dados do estabelecimento
  useEffect(() => {
    loadBusiness()
  }, [slug])

  // Carregar serviços quando o estabelecimento for carregado
  useEffect(() => {
    if (business) {
      loadServices()
    }
  }, [business])

  // Carregar profissionais quando o serviço for selecionado
  useEffect(() => {
    if (selectedService) {
      loadProfessionals()
    }
  }, [selectedService])

  // Carregar disponibilidade quando profissional for selecionado ou entrar no step 3
  useEffect(() => {
    if (selectedService && step === 3 && professionals.length > 0) {
      loadAvailability()
    }
  }, [selectedService, selectedProfessional, step, professionals])

  const loadBusiness = async () => {
    try {
      setLoadingBusiness(true)
      setError(null)
      const data = await bookingService.getBusiness(slug)
      // Backend retorna dados diretamente, não dentro de 'business'
      const businessData = data.business || data
      setBusiness(businessData)

      // Verificar se agendamento online está habilitado
      if (!businessData?.online_booking_enabled) {
        setError('Este estabelecimento não está aceitando agendamentos online no momento.')
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Estabelecimento não encontrado.')
      } else {
        setError('Erro ao carregar dados do estabelecimento.')
      }
    } finally {
      setLoadingBusiness(false)
    }
  }

  const loadServices = async () => {
    try {
      setLoadingServices(true)
      const data = await bookingService.getServices(slug)
      setServices(data.services || [])
    } catch (err) {
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoadingServices(false)
    }
  }

  const loadProfessionals = async () => {
    try {
      setLoadingProfessionals(true)
      const data = await bookingService.getProfessionals(slug, selectedService?.id)
      setProfessionals(data.professionals || [])
    } catch (err) {
      toast.error('Erro ao carregar profissionais')
    } finally {
      setLoadingProfessionals(false)
    }
  }

  const loadAvailability = async () => {
    try {
      setLoadingAvailability(true)
      const today = new Date().toISOString().split('T')[0]

      // Se não tem profissional selecionado, usa o primeiro disponível
      const professionalId = selectedProfessional?.id || (professionals.length > 0 ? professionals[0].id : null)

      if (!professionalId) {
        toast.error('Nenhum profissional disponível')
        return
      }

      const data = await bookingService.getAvailability(slug, {
        serviceId: selectedService.id,
        professionalId: professionalId,
        date: today,
        days: 14
      })
      setAvailability(data.availability || {})
    } catch (err) {
      toast.error('Erro ao carregar horários disponíveis')
    } finally {
      setLoadingAvailability(false)
    }
  }

  const validateClientData = () => {
    const errors = {}

    if (!clientData.name.trim()) {
      errors.name = 'Nome é obrigatório'
    } else if (clientData.name.trim().length < 3) {
      errors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    const phoneNumbers = clientData.phone.replace(/\D/g, '')
    if (!phoneNumbers) {
      errors.phone = 'Telefone é obrigatório'
    } else if (phoneNumbers.length < 10) {
      errors.phone = 'Telefone inválido'
    }

    if (clientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.email = 'Email inválido'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      toast.error('Selecione um serviço')
      return
    }

    if (step === 3 && (!selectedDate || !selectedTime)) {
      toast.error('Selecione uma data e horário')
      return
    }

    if (step === 4) {
      if (!validateClientData()) {
        toast.error('Preencha os campos obrigatórios')
        return
      }
      handleSubmit()
      return
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const clientPayload = {
        name: clientData.name.trim(),
        phone: clientData.phone,
        email: clientData.email.trim() || null,
        notes: clientData.notes.trim() || null
      }

      // Criar/atualizar cliente na base de dados
      try {
        await bookingService.createClient(slug, clientPayload)
      } catch (clientErr) {
        // Não bloqueia o agendamento se falhar ao salvar cliente
        console.warn('Erro ao salvar cliente:', clientErr)
      }

      const data = {
        service_id: selectedService.id,
        professional_id: selectedProfessional?.id || selectedTime?.professional_id || professionals[0]?.id,
        date: selectedDate,
        start_time: selectedTime.time,
        client: {
          name: clientPayload.name,
          phone: clientPayload.phone,
          email: clientPayload.email
        },
        notes: clientPayload.notes
      }

      const result = await bookingService.createAppointment(slug, data)

      toast.success('Agendamento realizado com sucesso!')
      const bookingCode = result.booking_code || result.appointment?.booking_code
      navigate(`/agendar/${slug}/confirmacao/${bookingCode}`, {
        state: { appointment: result.appointment, bookingCode }
      })
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao realizar agendamento'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Tela de loading inicial
  if (loadingBusiness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Ops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ServiceSelector
            services={services}
            selectedService={selectedService}
            onSelect={setSelectedService}
            loading={loadingServices}
          />
        )
      case 2:
        return (
          <ProfessionalSelector
            professionals={professionals}
            selectedProfessional={selectedProfessional}
            onSelect={setSelectedProfessional}
            loading={loadingProfessionals}
            allowAny={true}
          />
        )
      case 3:
        return (
          <DateTimePicker
            availability={availability}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={setSelectedDate}
            onSelectTime={setSelectedTime}
            loading={loadingAvailability}
          />
        )
      case 4:
        return (
          <>
            <BookingClientForm
              clientData={clientData}
              onChange={setClientData}
              errors={formErrors}
            />
            <div className="mt-6">
              <BookingSummary
                business={business}
                service={selectedService}
                professional={selectedProfessional}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                clientData={clientData}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  const getNextButtonText = () => {
    if (step === 4) {
      return submitting ? 'Confirmando...' : 'Confirmar Agendamento'
    }
    return 'Continuar'
  }

  const isNextDisabled = () => {
    if (submitting) return true
    if (step === 1 && !selectedService) return true
    if (step === 3 && (!selectedDate || !selectedTime)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Container principal */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
        {/* Header do estabelecimento */}
        <BusinessHeader business={business} />

        {/* Steps indicator */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <BookingSteps currentStep={step} />
        </div>

        {/* Conteúdo do step atual */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          {renderStep()}
        </div>

        {/* Botões de navegação */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              step === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isNextDisabled()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            {getNextButtonText()}
            {step < 4 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Link para consultar agendamento */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate(`/agendar/${slug}/consultar`)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Já tem um agendamento? Consulte aqui
          </button>
        </div>
      </div>
    </div>
  )
}
