import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import {
  Calendar,
  ArrowLeft,
  Loader2,
  Mail,
  Check
} from 'lucide-react'

export default function ProfessionalForgotPassword() {
  const navigate = useNavigate()
  const { forgotPassword } = useProfessionalAuth()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await forgotPassword(email)
      if (result.success) {
        setSuccess(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-jet-black-900 mb-2">
            Email enviado!
          </h1>
          <p className="text-jet-black-600 mb-8">
            Se existe uma conta com esse email, voce recebera um link para redefinir sua senha.
          </p>
          <button
            onClick={() => navigate('/profissional/login')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Voltar ao login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold text-jet-black-900">Agendar Mais</span>
            <span className="block text-sm text-jet-black-500">Portal do Profissional</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/profissional/login')}
            className="flex items-center gap-2 text-jet-black-500 hover:text-jet-black-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar ao login</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-jet-black-900 mb-2">
              Esqueceu a senha?
            </h2>
            <p className="text-jet-black-600">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-jet-black-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-black-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-jet-black-200 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Enviar link de recuperacao'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-jet-black-400 mt-6">
          Agendar Mais - Portal do Profissional
        </p>
      </div>
    </div>
  )
}
