import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Calendar,
  Users,
  Bell,
  BarChart3,
  Shield,
  Check,
  ArrowRight,
  Smartphone,
  Zap,
  Menu,
  X,
  ChevronDown,
  Scissors,
  Heart,
  Stethoscope,
  Dumbbell,
  Sparkles,
  Building2,
  Play,
  MessageCircle,
  CreditCard
} from 'lucide-react'

const PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29,
    popular: false,
    features: [
      'Até 100 agendamentos/mês',
      'Até 3 profissionais',
      'Lembretes básicos',
      'Suporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    popular: true,
    features: [
      'Agendamentos ilimitados',
      'Até 10 profissionais',
      'Lembretes WhatsApp/SMS',
      'Relatórios avançados',
      'Suporte prioritário'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    popular: false,
    features: [
      'Tudo do Pro',
      'Profissionais ilimitados',
      'API personalizada',
      'Gestor de conta dedicado',
      'Suporte 24/7'
    ]
  }
]

const FEATURES = [
  {
    icon: Calendar,
    title: 'Agendamento Online 24/7',
    description: 'Seus clientes agendam a qualquer hora, pelo celular ou computador. Sem ligações, sem espera.'
  },
  {
    icon: Bell,
    title: 'Lembretes Automáticos',
    description: 'WhatsApp, SMS ou email. Reduza faltas em até 80% com lembretes inteligentes.'
  },
  {
    icon: Users,
    title: 'Gestão de Equipe',
    description: 'Controle a agenda de múltiplos profissionais. Cada um com seus serviços e horários.'
  },
  {
    icon: BarChart3,
    title: 'Relatórios Completos',
    description: 'Acompanhe faturamento, serviços mais populares e desempenho da equipe em tempo real.'
  },
  {
    icon: Smartphone,
    title: 'Link Exclusivo',
    description: 'Compartilhe seu link de agendamento nas redes sociais, WhatsApp e site.'
  },
  {
    icon: Shield,
    title: 'Seguro e Confiável',
    description: 'Seus dados protegidos com criptografia SSL. Backup diário automático.'
  }
]

const SEGMENTS = [
  {
    icon: Scissors,
    name: 'Salões e Barbearias',
    description: 'Cortes, coloração, barba e muito mais'
  },
  {
    icon: Sparkles,
    name: 'Estética e Beleza',
    description: 'Procedimentos estéticos, unhas, maquiagem'
  },
  {
    icon: Stethoscope,
    name: 'Clínicas e Consultórios',
    description: 'Médicos, dentistas, psicólogos'
  },
  {
    icon: Dumbbell,
    name: 'Personal e Academia',
    description: 'Personal trainers, estúdios fitness'
  },
  {
    icon: Heart,
    name: 'Spa e Massagem',
    description: 'Massoterapia, spa day, relaxamento'
  },
  {
    icon: Building2,
    name: 'Outros Serviços',
    description: 'Tatuagem, pet shop, coaching e mais'
  }
]


const FAQ = [
  {
    question: 'Posso testar antes de assinar?',
    answer: 'Sim! Oferecemos 7 dias de teste grátis em todos os planos. Você pode explorar todas as funcionalidades sem compromisso e sem precisar cadastrar cartão de crédito.'
  },
  {
    question: 'Como meus clientes fazem o agendamento?',
    answer: 'Você recebe um link exclusivo (ex: agendamais.com/agendar/seu-negocio) que pode compartilhar no WhatsApp, Instagram, site ou onde preferir. Seus clientes acessam e agendam em segundos!'
  },
  {
    question: 'Preciso instalar algum aplicativo?',
    answer: 'Não! O AgendaMais funciona 100% online, direto no navegador. Você acessa de qualquer dispositivo - computador, tablet ou celular - sem precisar instalar nada.'
  },
  {
    question: 'Como funcionam os lembretes automáticos?',
    answer: 'Você configura quando quer que os lembretes sejam enviados (ex: 24h e 2h antes). O sistema envia automaticamente por WhatsApp, SMS ou email, reduzindo as faltas drasticamente.'
  },
  {
    question: 'Posso mudar de plano depois?',
    answer: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A mudança é proporcional e você só paga a diferença.'
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Você pode cancelar quando quiser, sem multas ou fidelidade. Basta acessar as configurações da sua conta.'
  }
]

function FAQItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-blue-600 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-48 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => {
    navigate('/registro')
  }

  const scrollToSection = (id) => {
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AgendaMais</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollToSection('segments')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Segmentos
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Planos
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                FAQ
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Ir ao Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Começar Grátis
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'
          }`}
        >
          <div className="bg-white px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Funcionalidades
            </button>
            <button
              onClick={() => scrollToSection('segments')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Segmentos
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              FAQ
            </button>
            <div className="pt-3 border-t border-gray-100 space-y-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                >
                  Ir ao Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="block w-full text-center py-2.5 text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-xl"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
                  >
                    Começar Grátis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50">
              <Zap className="w-4 h-4" />
              Teste grátis por 7 dias - Sem cartão de crédito
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              A agenda online que faz seu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                negócio crescer
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Seus clientes agendam 24h por dia, você recebe lembretes automáticos
              e nunca mais perde um horário. Tudo em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 group"
              >
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Ver Como Funciona
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-500" />
                <span>Sem cartão para testar</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                <span>Suporte humanizado</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 px-4 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Funcionalidades</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas e fáceis de usar para você focar no que importa: atender bem seus clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border border-gray-100 hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segments" className="py-20 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Para quem é</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Ideal para diversos segmentos
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              De salões de beleza a clínicas médicas, o AgendaMais se adapta ao seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {SEGMENTS.map((segment, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <segment.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {segment.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Primeiros passos</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Comece em 3 passos simples
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Configure sua agenda e comece a receber agendamentos em minutos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-blue-500/30">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Crie sua conta</h3>
              <p className="text-gray-600">
                Cadastre-se gratuitamente e configure seu negócio em minutos. Sem burocracia.
              </p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-purple-500/30">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Configure serviços</h3>
              <p className="text-gray-600">
                Adicione seus serviços, profissionais e horários de atendimento disponíveis.
              </p>
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-purple-200 to-transparent"></div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl shadow-pink-500/30">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compartilhe o link</h3>
              <p className="text-gray-600">
                Divulgue seu link exclusivo e comece a receber agendamentos online hoje!
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 mx-auto group"
            >
              Começar Agora - É Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Planos e Preços</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Todos os planos incluem 7 dias grátis. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20 md:scale-105 z-10'
                    : 'border border-gray-200 hover:border-blue-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-sm text-gray-500">R$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-green-600 font-semibold">
                    7 dias grátis para testar
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Começar Grátis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4 font-medium">
              Todos os planos incluem:
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100">
                <Check className="w-4 h-4 text-green-600" />
                <span>Suporte técnico</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100">
                <Check className="w-4 h-4 text-green-600" />
                <span>Atualizações automáticas</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100">
                <Check className="w-4 h-4 text-green-600" />
                <span>Segurança SSL</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100">
                <Check className="w-4 h-4 text-green-600" />
                <span>Backup diário</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-24 px-4 bg-gradient-to-br from-gray-50 to-white scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Tire suas dúvidas sobre o AgendaMais
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
            {FAQ.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Ainda tem dúvidas?{' '}
              <a href="mailto:suporte@agendamais.site" className="text-blue-600 hover:text-blue-700 font-medium">
                Fale conosco
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para organizar sua agenda?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram seu negócio.
            Comece seu teste gratuito de 7 dias agora!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-2xl flex items-center justify-center gap-2 group"
            >
              Criar Minha Conta Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AgendaMais</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A solução completa para gestão de agendamentos do seu negócio. Simples, prático e eficiente.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Planos</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="mailto:suporte@agendamais.site" className="hover:text-white transition-colors">suporte@agendamais.site</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AgendaMais. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-gray-500 text-sm">no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
