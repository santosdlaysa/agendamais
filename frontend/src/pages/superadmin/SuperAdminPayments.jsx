import { useState, useEffect } from 'react'
import {
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  X,
  TrendingUp,
  Calendar,
  Receipt
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'
import toast from 'react-hot-toast'

export default function SuperAdminPayments() {
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_payments: 0,
    last_30_days: { revenue: 0, count: 0 },
    monthly: []
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20
  })
  const [filters, setFilters] = useState({
    status: 'all',
    start_date: '',
    end_date: '',
    sort_by: 'paid_at',
    sort_order: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [pagination.page, filters])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      const response = await superAdminApi.getPaymentStats({ months: 6 })
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar estatisticas:', error)
      toast.error('Erro ao carregar estatisticas')
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status !== 'all' ? filters.status : undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
      }

      const response = await superAdminApi.getPayments(params)
      setPayments(response.data.payments || [])
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }))
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
      toast.error('Erro ao carregar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status) => {
    const colors = {
      paid: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      failed: 'bg-rose-100 text-rose-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status) => {
    const labels = {
      paid: 'Pago',
      pending: 'Pendente',
      failed: 'Falhou'
    }
    return labels[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      paid: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      pending: <Clock className="w-4 h-4 text-amber-500" />,
      failed: <XCircle className="w-4 h-4 text-rose-500" />
    }
    return icons[status] || null
  }

  const getPlanBadgeColor = (plan) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-700',
      pro: 'bg-violet-100 text-violet-700',
      enterprise: 'bg-amber-100 text-amber-700'
    }
    return colors[plan] || colors.basic
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPeriod = (start, end) => {
    if (!start || !end) return '-'
    const startDate = new Date(start).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    const endDate = new Date(end).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      start_date: '',
      end_date: '',
      sort_by: 'paid_at',
      sort_order: 'desc'
    })
  }

  const hasActiveFilters = filters.status !== 'all' || filters.start_date || filters.end_date

  // Preparar dados para o grafico simples
  const chartData = stats.monthly?.slice(0, 6).reverse() || []
  const maxRevenue = Math.max(...chartData.map(m => m.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Faturamento</h1>
          <p className="text-jet-black-500">Acompanhe os pagamentos e receita da plataforma</p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchPayments(); }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm text-jet-black-600">Receita Total</span>
          </div>
          {statsLoading ? (
            <div className="h-8 bg-jet-black-100 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-jet-black-900">
              {formatCurrency(stats.total_revenue)}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-sm text-jet-black-600">Ultimos 30 dias</span>
          </div>
          {statsLoading ? (
            <div className="h-8 bg-jet-black-100 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-jet-black-900">
              {formatCurrency(stats.last_30_days?.revenue)}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-sky-100 rounded-xl">
              <Receipt className="w-5 h-5 text-sky-600" />
            </div>
            <span className="text-sm text-jet-black-600">Total de Pagamentos</span>
          </div>
          {statsLoading ? (
            <div className="h-8 bg-jet-black-100 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-jet-black-900">
              {stats.total_payments?.toLocaleString('pt-BR') || 0}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-5 border border-jet-black-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-jet-black-600">Pagamentos (30 dias)</span>
          </div>
          {statsLoading ? (
            <div className="h-8 bg-jet-black-100 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold text-jet-black-900">
              {stats.last_30_days?.count?.toLocaleString('pt-BR') || 0}
            </p>
          )}
        </div>
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-jet-black-100">
          <h3 className="text-lg font-semibold text-jet-black-900 mb-4">Receita Mensal</h3>
          <div className="flex items-end gap-2 h-40">
            {chartData.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-jet-black-500 mb-1">
                    {formatCurrency(month.revenue)}
                  </span>
                  <div
                    className="w-full bg-violet-500 rounded-t-lg transition-all duration-300 hover:bg-violet-600"
                    style={{
                      height: `${Math.max((month.revenue / maxRevenue) * 120, 4)}px`
                    }}
                  />
                </div>
                <span className="text-xs text-jet-black-500 mt-2">
                  {new Date(month.month + '-01').toLocaleDateString('pt-BR', { month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="all">Todos os status</option>
              <option value="paid">Pago</option>
              <option value="pending">Pendente</option>
              <option value="failed">Falhou</option>
            </select>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
              filters.start_date || filters.end_date
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'bg-white border-jet-black-200 text-jet-black-700 hover:bg-jet-black-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Periodo
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-jet-black-600 hover:text-jet-black-900"
            >
              <X className="w-4 h-4" />
              Limpar
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-jet-black-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">Data Final</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-jet-black-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-jet-black-500">Carregando...</p>
          </div>
        ) : payments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-jet-black-50 border-b border-jet-black-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Plano
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Data Pagamento
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Periodo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jet-black-50">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-jet-black-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-jet-black-900">
                          {payment.company?.name || '-'}
                        </p>
                        <p className="text-sm text-jet-black-500">
                          {payment.company?.email || '-'}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPlanBadgeColor(payment.subscription?.plan)}`}>
                          {payment.subscription?.plan?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-jet-black-900">
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeColor(payment.status)}`}>
                            {getStatusLabel(payment.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-jet-black-600">
                        {formatDate(payment.paid_at)}
                      </td>
                      <td className="px-5 py-4 text-jet-black-600 text-sm">
                        {formatPeriod(payment.period_start, payment.period_end)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-5 py-4 border-t border-jet-black-100 flex items-center justify-between">
                <p className="text-sm text-jet-black-600">
                  Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                  {pagination.total} pagamentos
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 border border-jet-black-200 rounded-lg hover:bg-jet-black-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-jet-black-600">
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="p-2 border border-jet-black-200 rounded-lg hover:bg-jet-black-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
            <p className="text-jet-black-500">Nenhum pagamento encontrado</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-violet-600 hover:text-violet-700 text-sm font-medium"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
