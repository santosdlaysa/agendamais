import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Shield,
  Zap,
  Users
} from 'lucide-react'

export default function Login() {
  const location = useLocation()
  const isRegisterRoute = location.pathname === '/registro'

  const [isLogin, setIsLogin] = useState(!isRegisterRoute)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLogin(!isRegisterRoute)
  }, [isRegisterRoute])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          navigate('/dashboard')
        }
      } else {
        const result = await register(formData.name, formData.email, formData.password)
        if (result.success) {
          const loginResult = await login(formData.email, formData.password)
          if (loginResult.success) {
            navigate('/subscription/plans')
          }
        }
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

  const toggleMode = () => {
    const newIsLogin = !isLogin
    setIsLogin(newIsLogin)
    setFormData({ name: '', email: '', password: '' })
    navigate(newIsLogin ? '/login' : '/registro')
  }

  const benefits = [
    { icon: Calendar, text: 'Agendamento online 24/7' },
    { icon: Users, text: 'Gestão completa de clientes' },
    { icon: Zap, text: 'Lembretes automáticos' },
    { icon: Shield, text: 'Dados seguros e protegidos' }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-periwinkle-600 via-space-indigo-600 to-periwinkle-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-space-indigo-400/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-periwinkle-500/10 rounded-full blur-3xl"></div>
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
            <span className="text-2xl font-bold text-white">AgendaMais</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                {isLogin ? 'Bem-vindo de volta!' : 'Comece sua jornada'}
              </h1>
              <p className="text-xl text-periwinkle-100">
                {isLogin
                  ? 'Entre para acessar sua agenda e gerenciar seus agendamentos.'
                  : 'Crie sua conta e organize seu negócio de forma inteligente.'
                }
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
          <div className="flex items-center gap-2 text-periwinkle-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Seus dados estão seguros e protegidos</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#FAFAFA]">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-periwinkle-600 to-space-indigo-600 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AgendaMais</span>
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
              <span className="text-sm font-medium">Voltar ao início</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-jet-black-900 mb-2">
                {isLogin ? 'Entrar' : 'Criar conta'}
              </h2>
              <p className="text-jet-black-600">
                {isLogin
                  ? 'Digite seus dados para acessar sua conta'
                  : 'Preencha os dados para começar seu teste grátis'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field - Only for Register */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-jet-black-700">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Digite seu nome"
                    className="w-full px-4 py-3 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

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
                  className="w-full px-4 py-3 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition-all"
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
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 pr-12 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-periwinkle-500 focus:border-transparent transition-all"
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

              {/* Forgot Password - Only for Login */}
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-periwinkle-600 hover:text-periwinkle-700 font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-jet-black-900 hover:bg-jet-black-800 disabled:bg-jet-black-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-jet-black-900/20 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Entrar' : 'Criar conta'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Trial Badge - Only for Register */}
              {!isLogin && (
                <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700 font-medium">
                    3 dias grátis • Sem cartão de crédito
                  </span>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-jet-black-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#FAFAFA] text-jet-black-500">ou</span>
              </div>
            </div>

            {/* Toggle Mode */}
            <div className="text-center">
              <p className="text-jet-black-600">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                {' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-periwinkle-600 hover:text-periwinkle-700 font-semibold"
                >
                  {isLogin ? 'Cadastre-se' : 'Entrar'}
                </button>
              </p>
            </div>

            {/* Terms - Only for Register */}
            {!isLogin && (
              <p className="mt-6 text-center text-xs text-jet-black-500">
                Ao criar sua conta, você concorda com nossos{' '}
                <button onClick={() => navigate('/termos')} className="text-periwinkle-600 hover:underline">
                  Termos de Uso
                </button>
                {' '}e{' '}
                <button onClick={() => navigate('/privacidade')} className="text-periwinkle-600 hover:underline">
                  Política de Privacidade
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-jet-black-400">
          © {new Date().getFullYear()} AgendaMais. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
