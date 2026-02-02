import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSuperAdmin } from '../../contexts/SuperAdminContext'
import {
  Shield,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Lock,
  Building2
} from 'lucide-react'

export default function SuperAdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { login } = useSuperAdmin()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/superadmin/dashboard')
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

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Agendar Mais</span>
              <span className="block text-sm text-purple-200">Super Admin</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
                Painel Administrativo
              </h1>
              <p className="text-xl text-purple-100">
                Acesso restrito para gerenciamento da plataforma.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">Gerenciar todas as empresas</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">Controle de assinaturas</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-purple-200 text-sm">
            <Shield className="w-4 h-4" />
            <span>Acesso protegido e monitorado</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#FAFAFA]">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-r from-violet-600 to-purple-600 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Agendar Mais</span>
              <span className="block text-xs text-purple-200">Super Admin</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Acesso Restrito
              </div>
              <h2 className="text-3xl font-bold text-jet-black-900 mb-2">
                Login Administrativo
              </h2>
              <p className="text-jet-black-600">
                Entre com suas credenciais de super administrador
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
                  placeholder="admin@agendamais.com"
                  className="w-full px-4 py-3 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 pr-12 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-violet-600/20 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Acessar Painel
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>Aviso:</strong> Este acesso é monitorado. Tentativas de acesso
                não autorizado serão registradas.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-jet-black-400">
          © {new Date().getFullYear()} Agendar Mais. Painel Administrativo.
        </div>
      </div>
    </div>
  )
}
