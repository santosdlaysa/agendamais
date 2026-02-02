import { useState, useEffect } from 'react'
import { DollarSign, Calendar, Search, Building2, TrendingUp, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [currentPage, filters])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sort_by: 'paid_at',
        sort_order: 'desc'
      })

      if (filters.status !== 'all') {
        params.append('status', filters.status)
      }
      if (filters.startDate) {
        params.append('start_date', filters.startDate)
      }
      if (filters.endDate) {
        params.append('end_date', filters.endDate)
      }

      const response = await api.get(`/superadmin/payments?${params}`)
      setPayments(response.data.payments || [])
      setPagination(response.data.pagination || {})
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
      toast.error('Erro ao carregar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/superadmin/payments/stats?months=12')
      setStats(response.data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Falhou', color: 'bg-red-100 text-red-800' }
    }
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Faturamento</h1>
          <p className="text-gray-500">Histórico de pagamentos e receitas</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.total_revenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Últimos 30 dias</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.last_30_days?.revenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total de Pagamentos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_payments}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pagamentos (30 dias)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.last_30_days?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="paid">Pago</option>
            <option value="pending">Pendente</option>
            <option value="failed">Falhou</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data inicial"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data final"
          />

          <button
            onClick={() => setFilters({ status: 'all', startDate: '', endDate: '' })}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando pagamentos...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pagamento encontrado</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data do Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.company?.name || '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.company?.email || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {payment.subscription?.plan || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.paid_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.period_start && payment.period_end ? (
                      <>
                        {new Date(payment.period_start).toLocaleDateString('pt-BR')} - {new Date(payment.period_end).toLocaleDateString('pt-BR')}
                      </>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} pagamentos
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.has_prev}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let page
                if (pagination.pages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= pagination.pages - 2) {
                  page = pagination.pages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.has_next}
                className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Revenue Chart - Simple version */}
      {stats?.monthly && stats.monthly.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h2>
          <div className="space-y-3">
            {stats.monthly.slice(-6).map((month) => {
              const maxRevenue = Math.max(...stats.monthly.map(m => m.revenue))
              const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
              return (
                <div key={month.month} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 w-20">{month.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-28 text-right">
                    {formatCurrency(month.revenue)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
