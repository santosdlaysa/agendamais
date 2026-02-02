import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import {
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  Clock,
  BarChart3,
  Shield
} from 'lucide-react'

export default function ProfessionalLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { login } = useProfessionalAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/profissional/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const benefits = [
    { icon: Clock, text: 'Visualize sua agenda em tempo real' },
    { icon: UserCheck, text: 'Gerencie seus atendimentos' },
    { icon: BarChart3, text: 'Acompanhe suas estatisticas' },
    { icon: Shield, text: 'Acesso seguro e exclusivo' }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Agendar Mais</span>
              <span className="block text-sm text-emerald-100">Portal do Profissional</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                Sua agenda na palma da mao
              </h1>
              <p className="text-xl text-emerald-100">
                Acesse seus agendamentos, acompanhe seus atendimentos e visualize suas estatisticas.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-emerald-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Acesso exclusivo para profissionais cadastrados</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#FAFAFA]">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Agendar Mais</span>
              <span className="block text-xs text-emerald-100">Portal do Profissional</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-jet-black-500 hover:text-jet-black-900 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Voltar ao inicio</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                <UserCheck className="w-4 h-4" />
                Area do Profissional
              </div>
              <h2 className="text-3xl font-bold text-jet-black-900 mb-2">
                Entrar
              </h2>
              <p className="text-jet-black-600">
                Digite seus dados para acessar sua agenda
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-jet-black-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-jet-black-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 pr-12 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-jet-black-400 hover:text-jet-black-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/profissional/esqueci-senha')}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-jet-black-100 rounded-xl">
              <p className="text-sm text-jet-black-600">
                <strong>Primeiro acesso?</strong> Voce deve ter recebido um email de convite com um link para criar sua senha.
                Caso nao tenha recebido, entre em contato com o administrador do estabelecimento.
              </p>
            </div>

            {/* Admin Link */}
            <div className="mt-6 text-center">
              <p className="text-jet-black-500 text-sm">
                E administrador?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-periwinkle-600 hover:text-periwinkle-700 font-medium"
                >
                  Acessar painel admin
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-jet-black-400">
          Agendar Mais - Portal do Profissional
        </div>
      </div>
    </div>
  )
}
