import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'
import toast from 'react-hot-toast'

export default function SuperAdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('monthly')
  const [overview, setOverview] = useState({})
  const [revenueData, setRevenueData] = useState([])
  const [growthData, setGrowthData] = useState([])
  const [planDistribution, setPlanDistribution] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [overviewRes, revenueRes, growthRes, plansRes] = await Promise.allSettled([
        superAdminApi.getOverview(),
        superAdminApi.getRevenue({ period }),
        superAdminApi.getGrowth({ period }),
        superAdminApi.getPlanDistribution()
      ])

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value.data)
      }

      if (revenueRes.status === 'fulfilled') {
        setRevenueData(revenueRes.value.data.data || [])
      }

      if (growthRes.status === 'fulfilled') {
        setGrowthData(growthRes.value.data.data || [])
      }

      if (plansRes.status === 'fulfilled') {
        setPlanDistribution(plansRes.value.data.plans || [])
      }
    } catch (error) {
      toast.error('Erro ao carregar analytics')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const getPlanColor = (plan) => {
    const colors = {
      basic: { bg: 'bg-gray-500', light: 'bg-gray-100' },
      pro: { bg: 'bg-violet-500', light: 'bg-violet-100' },
      enterprise: { bg: 'bg-amber-500', light: 'bg-amber-100' }
    }
    return colors[plan] || colors.basic
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

  const totalPlanUsers = planDistribution.reduce((sum, p) => sum + (p.count || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Analytics</h1>
          <p className="text-jet-black-500">Metricas e indicadores da plataforma</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="daily">Diario</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            {overview.mrr_growth >= 0 ? (
              <span className="flex items-center text-sm text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
                {overview.mrr_growth}%
              </span>
            ) : (
              <span className="flex items-center text-sm text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
                {Math.abs(overview.mrr_growth)}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{formatCurrency(overview.total_mrr)}</p>
          <p className="text-sm text-jet-black-500">MRR (Receita Mensal)</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-violet-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{formatCurrency((overview.total_mrr || 0) * 12)}</p>
          <p className="text-sm text-jet-black-500">ARR (Receita Anual)</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
            <span className="flex items-center text-sm text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              {overview.new_companies_month || 0}
            </span>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{overview.active_companies || 0}</p>
          <p className="text-sm text-jet-black-500">Empresas Ativas</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 bg-rose-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{overview.churn_rate || 0}%</p>
          <p className="text-sm text-jet-black-500">Taxa de Churn</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-jet-black-900">Receita ao Longo do Tempo</h3>
            <BarChart3 className="w-5 h-5 text-jet-black-400" />
          </div>

          {revenueData.length > 0 ? (
            <div className="space-y-4">
              {revenueData.slice(-6).map((item, index) => {
                const maxRevenue = Math.max(...revenueData.map(d => d.revenue || 0))
                const percentage = maxRevenue > 0 ? ((item.revenue || 0) / maxRevenue) * 100 : 0

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-jet-black-600">{item.label || item.date}</span>
                      <span className="font-medium text-jet-black-900">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="h-3 bg-jet-black-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-jet-black-500">
              Nenhum dado de receita disponivel
            </div>
          )}
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-jet-black-900">Distribuicao por Plano</h3>
          </div>

          {planDistribution.length > 0 ? (
            <div className="space-y-6">
              {/* Visual Distribution */}
              <div className="flex h-4 rounded-full overflow-hidden">
                {planDistribution.map((plan, index) => {
                  const percentage = totalPlanUsers > 0 ? (plan.count / totalPlanUsers) * 100 : 0
                  const colors = getPlanColor(plan.plan)
                  return (
                    <div
                      key={index}
                      className={`${colors.bg} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                      title={`${plan.plan}: ${plan.count} (${percentage.toFixed(1)}%)`}
                    ></div>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {planDistribution.map((plan, index) => {
                  const percentage = totalPlanUsers > 0 ? ((plan.count / totalPlanUsers) * 100).toFixed(1) : 0
                  const colors = getPlanColor(plan.plan)

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors.bg}`}></div>
                        <span className="text-jet-black-700 capitalize">{plan.plan}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-jet-black-500">{plan.count} empresas</span>
                        <span className="font-medium text-jet-black-900">{percentage}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Revenue by Plan */}
              <div className="pt-4 border-t border-jet-black-100">
                <h4 className="text-sm font-medium text-jet-black-600 mb-3">Receita por Plano</h4>
                {planDistribution.map((plan, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-jet-black-700 capitalize">{plan.plan}</span>
                    <span className="font-medium text-jet-black-900">{formatCurrency(plan.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-jet-black-500">
              Nenhum dado de planos disponivel
            </div>
          )}
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-jet-black-900">Crescimento de Empresas</h3>
        </div>

        {growthData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jet-black-100">
                  <th className="text-left py-3 text-sm font-medium text-jet-black-600">Periodo</th>
                  <th className="text-right py-3 text-sm font-medium text-jet-black-600">Novas</th>
                  <th className="text-right py-3 text-sm font-medium text-jet-black-600">Canceladas</th>
                  <th className="text-right py-3 text-sm font-medium text-jet-black-600">Crescimento Liquido</th>
                </tr>
              </thead>
              <tbody>
                {growthData.slice(-6).map((item, index) => (
                  <tr key={index} className="border-b border-jet-black-50">
                    <td className="py-3 text-jet-black-900">{item.label || item.date}</td>
                    <td className="py-3 text-right">
                      <span className="text-emerald-600 font-medium">+{item.new_companies || 0}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-rose-600 font-medium">-{item.churned_companies || 0}</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className={`font-medium ${
                        (item.net_growth || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {(item.net_growth || 0) >= 0 ? '+' : ''}{item.net_growth || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-jet-black-500">
            Nenhum dado de crescimento disponivel
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h3 className="font-semibold text-jet-black-900 mb-4">Metricas de Aquisicao</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Novas Empresas (mes)</span>
              <span className="font-semibold text-jet-black-900">{overview.new_companies_month || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Conversao Trial</span>
              <span className="font-semibold text-jet-black-900">{overview.trial_conversion_rate || 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Empresas em Trial</span>
              <span className="font-semibold text-jet-black-900">{overview.trial_companies || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h3 className="font-semibold text-jet-black-900 mb-4">Metricas de Receita</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">ARPU (Medio por Empresa)</span>
              <span className="font-semibold text-jet-black-900">{formatCurrency(overview.arpu)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">LTV Estimado</span>
              <span className="font-semibold text-jet-black-900">{formatCurrency(overview.ltv)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Receita Total</span>
              <span className="font-semibold text-jet-black-900">{formatCurrency(overview.total_revenue)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-jet-black-100 p-6">
          <h3 className="font-semibold text-jet-black-900 mb-4">Metricas de Retencao</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Taxa de Retencao</span>
              <span className="font-semibold text-jet-black-900">{100 - (overview.churn_rate || 0)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Churn (mes)</span>
              <span className="font-semibold text-rose-600">{overview.churned_this_month || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-jet-black-600">Tempo Medio de Vida</span>
              <span className="font-semibold text-jet-black-900">{overview.avg_lifetime_months || 0} meses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
