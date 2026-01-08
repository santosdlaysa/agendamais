import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const OnboardingContext = createContext()

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Boas-vindas', completed: false },
  { id: 'business', title: 'Sua Empresa', completed: false },
  { id: 'services', title: 'Serviços', completed: false },
  { id: 'professionals', title: 'Profissionais', completed: false },
  { id: 'schedule', title: 'Horários', completed: false },
  { id: 'complete', title: 'Pronto!', completed: false }
]

export function OnboardingProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(ONBOARDING_STEPS)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [onboardingData, setOnboardingData] = useState({
    business: {
      business_name: '',
      slug: '',
      business_phone: '',
      business_address: ''
    },
    service: {
      name: '',
      duration: 30,
      price: ''
    },
    professional: {
      name: '',
      role: '',
      email: '',
      phone: ''
    },
    schedule: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: true, start: '09:00', end: '13:00' },
      sunday: { enabled: false, start: '09:00', end: '18:00' }
    }
  })

  // Verificar se precisa mostrar onboarding
  useEffect(() => {
    if (isAuthenticated && user) {
      checkOnboardingStatus()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const checkOnboardingStatus = async () => {
    try {
      // Verificar se já completou onboarding (salvo no localStorage ou backend)
      const onboardingCompleted = localStorage.getItem(`onboarding_completed_${user?.id}`)

      if (onboardingCompleted === 'true') {
        setShowOnboarding(false)
        setLoading(false)
        return
      }

      // Verificar se já tem dados básicos configurados
      const [businessRes, servicesRes, professionalsRes] = await Promise.all([
        api.get('/auth/business').catch(() => ({ data: { business: {} } })),
        api.get('/services').catch(() => ({ data: { services: [] } })),
        api.get('/professionals').catch(() => ({ data: { professionals: [] } }))
      ])

      const business = businessRes.data.business || businessRes.data || {}
      const services = servicesRes.data.services || []
      const professionals = professionalsRes.data.professionals || []

      // Se já tem empresa, serviço e profissional configurados, não mostra onboarding
      const hasBusinessData = business.business_name && business.slug
      const hasServices = services.length > 0
      const hasProfessionals = professionals.length > 0

      if (hasBusinessData && hasServices && hasProfessionals) {
        localStorage.setItem(`onboarding_completed_${user?.id}`, 'true')
        setShowOnboarding(false)
      } else {
        // Preencher dados existentes
        if (business.business_name || business.slug) {
          setOnboardingData(prev => ({
            ...prev,
            business: {
              business_name: business.business_name || '',
              slug: business.slug || '',
              business_phone: business.business_phone || '',
              business_address: business.business_address || ''
            }
          }))
        }
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error)
      setShowOnboarding(true)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Marcar passo atual como completo
      setSteps(prev => prev.map((step, idx) =>
        idx === currentStep ? { ...step, completed: true } : step
      ))
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex)
    }
  }

  const updateOnboardingData = (section, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
  }

  const completeOnboarding = () => {
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true')
    }
    setShowOnboarding(false)
  }

  const skipOnboarding = () => {
    if (user?.id) {
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true')
    }
    setShowOnboarding(false)
  }

  const resetOnboarding = () => {
    if (user?.id) {
      localStorage.removeItem(`onboarding_completed_${user.id}`)
    }
    setCurrentStep(0)
    setSteps(ONBOARDING_STEPS)
    setShowOnboarding(true)
  }

  const value = {
    currentStep,
    steps,
    showOnboarding,
    loading,
    onboardingData,
    nextStep,
    prevStep,
    goToStep,
    updateOnboardingData,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding deve ser usado dentro de um OnboardingProvider')
  }
  return context
}
