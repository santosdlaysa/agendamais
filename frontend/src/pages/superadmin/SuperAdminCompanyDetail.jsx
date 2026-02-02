import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  CreditCard,
  Clock,
  Ban,
  CheckCircle,
  TrendingUp,
  ExternalLink,
  Edit,
  RefreshCw
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'
import toast from 'react-hot-toast'

export default function SuperAdminCompanyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [extendDays, setExtendDays] = useState(30)

  useEffect(() => {
    fetchCompany()
  }, [id])

  const fetchCompany = async () => {
    try {
      setLoading(true)
      const response = await superAdminApi.getCompany(id)
      setCompany(response.data)
    } catch (error) {
      toast.error('Erro ao carregar empresa')
      navigate('/superadmin/companies')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async () => {
    if (!confirm('Tem certeza que deseja suspender esta empresa?')) return

    try {
      await superAdminApi.suspendCompany(id, 'Suspensa pelo administrador')
      toast.success('Empresa suspensa com sucesso')
      fetchCompany()
    } catch (error) {
      toast.error('Erro ao suspender empresa')
    }
  }

  const handleActivate = async () => {
    try {
      await superAdminApi.activateCompany(id)
      toast.success('Empresa ativada com sucesso')
      fetchCompany()
    } catch (error) {
      toast.error('Erro ao ativar empresa')
    }
  }

  const handleChangePlan = async () => {
    if (!selectedPlan) return

    try {
      await superAdminApi.changePlan(company.subscription?.id, selectedPlan)
      toast.success('Plano alterado com sucesso')
      setShowPlanModal(false)
      fetchCompany()
    } catch (error) {
      toast.error('Erro ao alterar plano')
    }
  }

  const handleExtend = async () => {
    try {
      await superAdminApi.extendSubscription(company.subscription?.id, extendDays)
      toast.success(`Assinatura estendida por ${extendDays} dias`)
      setShowExtendModal(false)
      fetchCompany()
    } catch (error) {
      toast.error('Erro ao estender assinatura')
    }
  }

  const getPlanBadgeColor = (plan) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700',
      pro: 'bg-violet-100 text-violet-700',
      enterprise: 'bg-amber-100 text-amber-700'
    }
    return colors[plan] || colors.basic
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-700',
      trialing: 'bg-sky-100 text-sky-700',
      past_due: 'bg-amber-100 text-amber-700',
      canceled: 'bg-rose-100 text-rose-700',
      suspended: 'bg-red-100 text-red-700'
    }
    return colors[status] || colors.active
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativo',
      trialing: 'Trial',
      past_due: 'Atrasado',
      canceled: 'Cancelado',
      suspended: 'Suspenso'
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-jet-black-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!company) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/superadmin/companies')}
          className="p-2 hover:bg-jet-black-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-jet-black-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-jet-black-900">{company.business_name}</h1>
          <p className="text-jet-black-500">/{company.slug}</p>
        </div>
        <button
          onClick={fetchCompany}
          className="p-2 hover:bg-jet-black-100 rounded-xl transition-colors"
          title="Atualizar"
        >
          <RefreshCw className="w-5 h-5 text-jet-black-600" />
        </button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{company.stats?.total_clients || 0}</p>
          <p className="text-sm text-jet-black-500">Clientes</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{company.stats?.total_appointments || 0}</p>
          <p className="text-sm text-jet-black-500">Agendamentos</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-jet-black-900">
            R$ {(company.stats?.total_revenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-jet-black-500">Receita Total</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{company.stats?.total_services || 0}</p>
          <p className="text-sm text-jet-black-500">Servicos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-6">
            <h3 className="font-semibold text-jet-black-900 mb-4">Informacoes da Empresa</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-jet-black-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Nome</p>
                  <p className="font-medium text-jet-black-900">{company.business_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-jet-black-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Email do Proprietario</p>
                  <p className="font-medium text-jet-black-900">{company.owner_email}</p>
                </div>
              </div>

              {company.business_phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-jet-black-600" />
                  </div>
                  <div>
                    <p className="text-sm text-jet-black-500">Telefone</p>
                    <p className="font-medium text-jet-black-900">{company.business_phone}</p>
                  </div>
                </div>
              )}

              {company.business_address && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-jet-black-600" />
                  </div>
                  <div>
                    <p className="text-sm text-jet-black-500">Endereco</p>
                    <p className="font-medium text-jet-black-900">{company.business_address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-jet-black-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Cadastrado em</p>
                  <p className="font-medium text-jet-black-900">
                    {new Date(company.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-jet-black-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="w-5 h-5 text-jet-black-600" />
                </div>
                <div>
                  <p className="text-sm text-jet-black-500">Link de Agendamento</p>
                  <a
                    href={`/agendar/${company.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-violet-600 hover:text-violet-700"
                  >
                    /agendar/{company.slug}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription History */}
          {company.subscription_history?.length > 0 && (
            <div className="bg-white rounded-xl border border-jet-black-100 p-6">
              <h3 className="font-semibold text-jet-black-900 mb-4">Historico de Assinatura</h3>
              <div className="space-y-3">
                {company.subscription_history.map((event, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-jet-black-50 rounded-xl">
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'created' ? 'bg-emerald-500' :
                      event.type === 'upgraded' ? 'bg-violet-500' :
                      event.type === 'downgraded' ? 'bg-amber-500' :
                      event.type === 'canceled' ? 'bg-rose-500' :
                      'bg-jet-black-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-jet-black-900">{event.description}</p>
                      <p className="text-xs text-jet-black-500">
                        {new Date(event.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Card */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-jet-black-900">Assinatura</h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeColor(company.subscription?.status)}`}>
                {getStatusLabel(company.subscription?.status)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-jet-black-600">Plano</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPlanBadgeColor(company.subscription?.plan)}`}>
                  {company.subscription?.plan?.toUpperCase() || 'FREE'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-jet-black-600">MRR</span>
                <span className="font-semibold text-jet-black-900">
                  R$ {(company.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {company.subscription?.start_date && (
                <div className="flex items-center justify-between">
                  <span className="text-jet-black-600">Inicio</span>
                  <span className="text-jet-black-900">
                    {new Date(company.subscription.start_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              {company.subscription?.end_date && (
                <div className="flex items-center justify-between">
                  <span className="text-jet-black-600">Vencimento</span>
                  <span className="text-jet-black-900">
                    {new Date(company.subscription.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              {company.subscription?.trial_end && (
                <div className="flex items-center justify-between">
                  <span className="text-jet-black-600">Fim do Trial</span>
                  <span className="text-jet-black-900">
                    {new Date(company.subscription.trial_end).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-jet-black-100 space-y-2">
              <button
                onClick={() => {
                  setSelectedPlan(company.subscription?.plan || 'basic')
                  setShowPlanModal(true)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-50 text-violet-700 rounded-xl hover:bg-violet-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Alterar Plano
              </button>

              <button
                onClick={() => setShowExtendModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 text-sky-700 rounded-xl hover:bg-sky-100 transition-colors"
              >
                <Clock className="w-4 h-4" />
                Estender Periodo
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-6">
            <h3 className="font-semibold text-jet-black-900 mb-4">Acoes</h3>
            <div className="space-y-2">
              {company.subscription?.status === 'suspended' ? (
                <button
                  onClick={handleActivate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Ativar Empresa
                </button>
              ) : (
                <button
                  onClick={handleSuspend}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
                >
                  <Ban className="w-4 h-4" />
                  Suspender Empresa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-jet-black-900 mb-4">Alterar Plano</h3>
            <div className="space-y-3 mb-6">
              {['basic', 'pro', 'enterprise'].map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedPlan === plan
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-jet-black-100 hover:border-jet-black-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan}
                    checked={selectedPlan === plan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span className="font-medium text-jet-black-900 capitalize">{plan}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-4 py-2.5 border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePlan}
                className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-jet-black-900 mb-4">Estender Periodo</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-jet-black-700 mb-2">
                Dias para estender
              </label>
              <input
                type="number"
                value={extendDays}
                onChange={(e) => setExtendDays(parseInt(e.target.value) || 0)}
                min="1"
                max="365"
                className="w-full px-4 py-2.5 border border-jet-black-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExtendModal(false)}
                className="flex-1 px-4 py-2.5 border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExtend}
                className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
