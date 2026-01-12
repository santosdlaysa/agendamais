import { useState, useEffect, useRef } from 'react'
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
  Menu,
  X,
  ChevronDown,
  Scissors,
  Heart,
  Stethoscope,
  Dumbbell,
  Sparkles,
  Building2,
  Clock,
  Star,
  Zap,
  Globe,
  MousePointer,
  MessageCircle
} from 'lucide-react'

const PLANS = [
  {
    id: 'basic',
    name: 'Starter',
    price: 29,
    description: 'Perfeito para começar',
    features: [
      'Até 100 agendamentos/mês',
      'Até 3 profissionais',
      'Lembretes por email',
      'Suporte por email'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 59,
    popular: true,
    description: 'Mais recursos, mais crescimento',
    features: [
      'Agendamentos ilimitados',
      'Até 10 profissionais',
      'Lembretes WhatsApp + SMS',
      'Relatórios avançados',
      'Suporte prioritário'
    ]
  },
  {
    id: 'enterprise',
    name: 'Business',
    price: 99,
    description: 'Para grandes operações',
    features: [
      'Tudo do Professional',
      'Profissionais ilimitados',
      'API personalizada',
      'Gestor dedicado',
      'Suporte 24/7'
    ]
  }
]

const FEATURES = [
  {
    icon: Globe,
    title: 'Agendamento 24/7',
    description: 'Seus clientes agendam a qualquer momento, de qualquer lugar.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: Bell,
    title: 'Lembretes Inteligentes',
    description: 'Reduza faltas em até 80% com notificações automáticas.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: Users,
    title: 'Gestão de Equipe',
    description: 'Cada profissional com sua agenda, serviços e horários.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: BarChart3,
    title: 'Insights em Tempo Real',
    description: 'Acompanhe métricas e tome decisões baseadas em dados.',
    color: 'from-sky-500 to-blue-600'
  },
  {
    icon: Smartphone,
    title: 'Link Exclusivo',
    description: 'Compartilhe nas redes sociais e receba agendamentos.',
    color: 'from-pink-500 to-rose-600'
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Criptografia SSL e backup diário automático.',
    color: 'from-slate-500 to-slate-700'
  }
]

const SEGMENTS = [
  { icon: Scissors, name: 'Salões & Barbearias' },
  { icon: Sparkles, name: 'Estética & Beleza' },
  { icon: Stethoscope, name: 'Clínicas & Consultórios' },
  { icon: Dumbbell, name: 'Personal & Fitness' },
  { icon: Heart, name: 'Spa & Bem-estar' },
  { icon: Building2, name: 'Outros Serviços' }
]

const FAQ = [
  {
    q: 'Posso testar antes de assinar?',
    a: 'Sim! Oferecemos 7 dias grátis em todos os planos, sem precisar de cartão de crédito.'
  },
  {
    q: 'Como meus clientes agendam?',
    a: 'Você recebe um link exclusivo para compartilhar onde quiser. Seus clientes acessam e agendam em segundos!'
  },
  {
    q: 'Preciso instalar algum app?',
    a: 'Não! Funciona 100% no navegador, em qualquer dispositivo.'
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim, sem multas ou fidelidade. Cancele diretamente nas configurações.'
  }
]

const TESTIMONIALS = [
  {
    name: 'Mariana Costa',
    role: 'Dona de Salão',
    text: 'Reduzi as faltas em 70% com os lembretes automáticos. Melhor investimento que fiz!',
    avatar: 'M'
  },
  {
    name: 'Carlos Eduardo',
    role: 'Barbeiro',
    text: 'Meus clientes adoram poder agendar pelo celular. Organização total da minha agenda.',
    avatar: 'C'
  },
  {
    name: 'Dra. Amanda',
    role: 'Dentista',
    text: 'Sistema intuitivo e profissional. Recomendo para qualquer consultório.',
    avatar: 'A'
  }
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetStarted = () => navigate('/registro')

  const scrollTo = (id) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                AgendaMais
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {['Recursos', 'Segmentos', 'Preços', 'FAQ'].map((item, i) => (
                <button
                  key={item}
                  onClick={() => scrollTo(['features', 'segments', 'pricing', 'faq'][i])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={isAuthenticated ? () => navigate('/dashboard') : handleGetStarted}
                className="group px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5"
              >
                {isAuthenticated ? 'Dashboard' : 'Começar Grátis'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-t transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="px-6 py-4 space-y-2">
            {['Recursos', 'Segmentos', 'Preços', 'FAQ'].map((item, i) => (
              <button
                key={item}
                onClick={() => scrollTo(['features', 'segments', 'pricing', 'faq'][i])}
                className="block w-full text-left px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
              >
                {item}
              </button>
            ))}
            <div className="pt-4 border-t space-y-2">
              <button
                onClick={() => navigate('/login')}
                className="block w-full px-4 py-3 text-center text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                Entrar
              </button>
              <button
                onClick={handleGetStarted}
                className="block w-full px-4 py-3 text-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl"
              >
                Começar Grátis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-violet-200/40 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-[5%] w-[600px] h-[600px] bg-gradient-to-tl from-indigo-200/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-[20%] w-[300px] h-[300px] bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700">
                +2.000 negócios já usam AgendaMais
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
              Sua agenda
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  sempre cheia
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 4 150 0 298 6" stroke="url(#paint0_linear)" strokeWidth="4" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="8" x2="298" y2="8">
                      <stop stopColor="#7C3AED"/>
                      <stop offset="1" stopColor="#4F46E5"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed mb-10 max-w-2xl">
              Clientes agendam 24h, você recebe lembretes automáticos e
              <span className="text-gray-900 font-medium"> nunca mais perde um horário</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-1"
              >
                Começar Gratuitamente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => scrollTo('demo')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border border-gray-200 transition-all duration-300"
              >
                <MousePointer className="w-5 h-5" />
                Ver Demonstração
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span>7 dias grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-violet-600" />
                </div>
                <span>Sem cartão</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <span>Setup em 5 min</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Floating Cards */}
          <div className="hidden xl:block absolute top-20 right-0 w-[500px]">
            {/* Main Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Próximo Agendamento</p>
                    <p className="text-sm text-gray-500">Hoje às 14:00</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'Maria S.', service: 'Corte + Escova', time: '14:00', color: 'bg-violet-500' },
                    { name: 'João P.', service: 'Barba', time: '15:00', color: 'bg-emerald-500' },
                    { name: 'Ana L.', service: 'Coloração', time: '16:30', color: 'bg-amber-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white font-semibold`}>
                          {item.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.service}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Mini Card - Stats */}
              <div className="absolute -left-16 top-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">+47%</p>
                    <p className="text-xs text-gray-500">Este mês</p>
                  </div>
                </div>
              </div>

              {/* Floating Mini Card - Reminder */}
              <div className="absolute -right-8 -bottom-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Lembrete enviado</p>
                    <p className="text-xs text-gray-500">Maria S. - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Logos Strip */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 mb-8">Usado por profissionais em todo o Brasil</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {SEGMENTS.map((seg, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400">
                <seg.icon className="w-5 h-5" />
                <span className="font-medium">{seg.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              Demonstração
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Simples de usar, poderoso de verdade
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma interface limpa e intuitiva para você focar no que importa
            </p>
          </div>

          {/* Browser Mockup */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-t-2xl p-4 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-800 rounded-lg px-4 py-1.5 flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-green-500" />
                  agendamais.site/dashboard
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-b-2xl border border-t-0 border-gray-200 shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">AgendaMais</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 font-semibold">
                    M
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-200 text-sm mb-1">Quinta-feira, 12 de Janeiro</p>
                      <h3 className="text-2xl font-bold mb-1">Boa tarde!</h3>
                      <p className="text-violet-100">Você tem 5 agendamentos hoje</p>
                    </div>
                    <div className="hidden sm:flex gap-4">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold">5</p>
                        <p className="text-xs text-violet-200">Hoje</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold">87%</p>
                        <p className="text-xs text-violet-200">Taxa</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Clientes', value: '156', icon: Users, color: 'amber' },
                    { label: 'Serviços', value: '12', icon: Sparkles, color: 'violet' },
                    { label: 'Este mês', value: '47', icon: Calendar, color: 'sky' },
                    { label: 'Receita', value: 'R$ 8.4k', icon: BarChart3, color: 'emerald' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent List */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Agendamentos de Hoje</h4>
                    <span className="text-sm text-violet-600 font-medium">Ver todos</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { name: 'Maria Silva', service: 'Corte + Escova', time: '14:00', status: 'confirmado' },
                      { name: 'João Pedro', service: 'Barba', time: '15:00', status: 'confirmado' },
                      { name: 'Ana Costa', service: 'Coloração', time: '16:30', status: 'pendente' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl flex items-center justify-center text-white font-semibold">
                            {item.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{item.time}</p>
                          <span className={`text-xs font-medium ${
                            item.status === 'confirmado' ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {item.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Experimente Grátis
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              Recursos
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Tudo em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas poderosas para gerenciar seu negócio de forma inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 bg-gray-50 hover:bg-white rounded-3xl border border-transparent hover:border-gray-200 hover:shadow-xl transition-all duration-500"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section id="segments" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
                Para Você
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Feito para quem<br />trabalha com hora marcada
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                De salões de beleza a consultórios médicos, o AgendaMais se adapta ao seu negócio.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {SEGMENTS.map((seg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <seg.icon className="w-6 h-6 text-violet-600" />
                    </div>
                    <span className="font-medium text-gray-900">{seg.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={`p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
                    i === 1 ? 'lg:translate-x-8' : ''
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur text-white rounded-full text-sm font-semibold mb-4">
              Como Funciona
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              3 passos para começar
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Configure em minutos e comece a receber agendamentos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Crie sua conta', desc: 'Cadastro gratuito em menos de 2 minutos' },
              { num: '02', title: 'Configure', desc: 'Adicione serviços, equipe e horários' },
              { num: '03', title: 'Compartilhe', desc: 'Envie seu link e receba agendamentos' }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <div className="relative bg-gray-800 p-8 rounded-3xl border border-gray-700 h-full">
                  <span className="text-6xl font-bold text-gray-700 group-hover:text-violet-500 transition-colors">
                    {step.num}
                  </span>
                  <h3 className="text-2xl font-bold mt-4 mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-700"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-semibold mb-4">
              Planos
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600">
              7 dias grátis em todos os planos. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-8 rounded-3xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gray-900 text-white scale-105 shadow-2xl'
                    : 'bg-white border-2 border-gray-100 hover:border-violet-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-bold rounded-full shadow-lg">
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className={plan.popular ? 'text-gray-400' : 'text-gray-500'}>{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>R$</span>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? 'text-gray-400' : 'text-gray-500'}>/mês</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-violet-500' : 'bg-emerald-100'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-emerald-600'}`} />
                      </div>
                      <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Começar Grátis
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-gray-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Dúvidas frequentes
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {FAQ.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? -1 : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openFAQ === i ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === i ? 'max-h-40' : 'max-h-0'
                }`}>
                  <p className="px-6 pb-5 text-gray-600">{item.a}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-gray-600">
            Ainda tem dúvidas?{' '}
            <a href="mailto:suporte@agendamais.site" className="text-violet-600 font-semibold hover:underline">
              Fale conosco
            </a>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram seu negócio com AgendaMais
          </p>
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            Criar Minha Conta Grátis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-violet-200 mt-6 text-sm">
            7 dias grátis • Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AgendaMais</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                A solução completa para gestão de agendamentos do seu negócio.
              </p>
            </div>

            {[
              { title: 'Produto', links: ['Recursos', 'Planos', 'FAQ'] },
              { title: 'Suporte', links: ['suporte@agendamais.site', 'Central de Ajuda'] },
              { title: 'Legal', links: ['Termos de Uso', 'Privacidade', 'LGPD'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AgendaMais. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>no Brasil</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
