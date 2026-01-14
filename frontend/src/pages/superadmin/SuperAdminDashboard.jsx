import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  DollarSign,
  Users,
  Calendar,
  TrendingDown,
  Activity,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_companies: 0,
    active_companies: 0,
    trial_companies: 0,
    total_mrr: 0,
    churn_rate: 0,
    growth_rate: 0
  })
  const [alerts, setAlerts] = useState([])
  const [recentCompanies, setRecentCompanies] = useState([])
  const [expiringSubscriptions, setExpiringSubscriptions] = useState([])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, companiesRes, expiringRes, alertsRes] = await Promise.allSettled([
        superAdminApi.getOverview(),
        superAdminApi.getCompanies({ per_page: 5, sort_by: 'created_at', order: 'desc' }),
        superAdminApi.getExpiringSubscriptions(7),
        superAdminApi.getAlerts()
      ])

      if (overviewRes.status === 'fulfilled') {
        setStats(overviewRes.value.data)
      }

      if (companiesRes.status === 'fulfilled') {
        setRecentCompanies(companiesRes.value.data.companies || [])
      }

      if (expiringRes.status === 'fulfilled') {
        setExpiringSubscriptions(expiringRes.value.data.subscriptions || [])
      }

      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value.data.alerts || [])
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-violet-200 text-sm mb-1 capitalize">{getFormattedDate()}</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{getGreeting()}, Admin!</h1>
            <p className="text-violet-100">
              Painel de controle da plataforma AgendaMais
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-2xl md:text-3xl font-bold">{stats.active_companies || 0}</p>
              <p className="text-xs text-violet-200">Empresas Ativas</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-xl md:text-2xl font-bold">
                R$ {(stats.total_mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-violet-200">MRR</p>
            </div>
            <div className="hidden sm:block bg-white/10 backdrop-blur rounded-xl p-4 text-center min-w-[80px]">
              <p className="text-2xl md:text-3xl font-bold">{stats.trial_companies || 0}</p>
              <p className="text-xs text-violet-200">Em Trial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/superadmin/companies')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">{stats.total_companies || 0}</p>
          <p className="text-sm text-jet-black-500">Total de Empresas</p>
        </div>

        <div
          onClick={() => navigate('/superadmin/subscriptions')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CreditCard className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-jet-black-900">
            R$ {((stats.total_mrr || 0) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-jet-black-500">ARR Projetado</p>
        </div>

        <div
          onClick={() => navigate('/superadmin/analytics')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">
            {stats.growth_rate >= 0 ? '+' : ''}{stats.growth_rate || 0}%
          </p>
          <p className="text-sm text-jet-black-500">Crescimento MoM</p>
        </div>

        <div
          onClick={() => navigate('/superadmin/analytics')}
          className="bg-white rounded-xl p-5 border border-jet-black-100 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/50 cursor-pointer transition-all duration-300 group"
        >
          <div className="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-jet-black-900">{stats.churn_rate || 0}%</p>
          <p className="text-sm text-jet-black-500">Taxa de Churn</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Companies List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-jet-black-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-jet-black-100 flex items-center justify-between">
            <h3 className="font-semibold text-jet-black-900">Empresas Recentes</h3>
            <button
              onClick={() => navigate('/superadmin/companies')}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 group"
            >
              Ver todas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {recentCompanies.length > 0 ? (
            <div className="divide-y divide-jet-black-50">
              {recentCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => navigate(`/superadmin/companies/${company.id}`)}
                  className="flex items-center justify-between px-5 py-4 hover:bg-jet-black-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                      {company.business_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-jet-black-900">{company.business_name}</p>
                      <p className="text-sm text-jet-black-500">{company.owner_email}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlanBadgeColor(company.subscription?.plan)}`}>
                        {company.subscription?.plan?.toUpperCase() || 'FREE'}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(company.subscription?.status)}`}>
                      {getStatusLabel(company.subscription?.status)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-jet-black-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
              <p className="text-jet-black-500">Nenhuma empresa cadastrada</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expiring Subscriptions */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-jet-black-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Vencendo em 7 dias
              </h3>
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                {expiringSubscriptions.length}
              </span>
            </div>

            {expiringSubscriptions.length > 0 ? (
              <div className="space-y-3">
                {expiringSubscriptions.slice(0, 5).map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => navigate(`/superadmin/companies/${sub.company_id}`)}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-jet-black-900 text-sm">{sub.company_name}</p>
                      <p className="text-xs text-jet-black-500">
                        Vence em {new Date(sub.end_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-amber-600" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-jet-black-500 text-center py-4">
                Nenhuma assinatura vencendo
              </p>
            )}
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-jet-black-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Alertas
              </h3>
              {alerts.length > 0 && (
                <span className="text-xs font-medium px-2 py-1 bg-rose-100 text-rose-700 rounded-full">
                  {alerts.length}
                </span>
              )}
            </div>

            {alerts.length > 0 ? (
              <div className="space-y-2">
                {alerts.slice(0, 5).map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl text-sm ${
                      alert.type === 'critical' ? 'bg-rose-50 text-rose-700' :
                      alert.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                      'bg-sky-50 text-sky-700'
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-jet-black-500">Tudo funcionando normalmente</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-jet-black-100 p-5">
            <h3 className="font-semibold text-jet-black-900 mb-4">Resumo Rapido</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Empresas Ativas</span>
                <span className="font-semibold text-jet-black-900">{stats.active_companies || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Em Trial</span>
                <span className="font-semibold text-jet-black-900">{stats.trial_companies || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Pagamentos Atrasados</span>
                <span className="font-semibold text-rose-600">{stats.past_due_companies || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-jet-black-600">Canceladas (mes)</span>
                <span className="font-semibold text-jet-black-900">{stats.canceled_this_month || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
