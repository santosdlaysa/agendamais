import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  X,
  ExternalLink
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'
import toast from 'react-hot-toast'

export default function SuperAdminSubscriptions() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [subscriptions, setSubscriptions] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: 10
  })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    expiring: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    active: 0,
    trialing: 0,
    past_due: 0,
    canceled: 0
  })

  useEffect(() => {
    fetchSubscriptions()
  }, [pagination.page, filters])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pagination.page === 1) {
        fetchSubscriptions()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        search: search || undefined,
        status: filters.status || undefined,
        plan: filters.plan || undefined,
        expiring_soon: filters.expiring || undefined
      }

      const response = await superAdminApi.getSubscriptions(params)
      setSubscriptions(response.data.subscriptions || [])
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }))

      if (response.data.stats) {
        setStats(response.data.stats)
      }
    } catch (error) {
      toast.error('Erro ao carregar assinaturas')
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
      canceled: 'bg-rose-100 text-rose-700'
    }
    return colors[status] || colors.active
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Ativo',
      trialing: 'Trial',
      past_due: 'Atrasado',
      canceled: 'Cancelado'
    }
    return labels[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      trialing: <Clock className="w-4 h-4 text-sky-500" />,
      past_due: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      canceled: <XCircle className="w-4 h-4 text-rose-500" />
    }
    return icons[status] || null
  }

  const clearFilters = () => {
    setFilters({ status: '', plan: '', expiring: false })
    setSearch('')
  }

  const hasActiveFilters = filters.status || filters.plan || filters.expiring || search

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Assinaturas</h1>
          <p className="text-jet-black-500">Gerencie todas as assinaturas da plataforma</p>
        </div>
        <button
          onClick={fetchSubscriptions}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'active' ? '' : 'active' }))}
          className={`bg-white rounded-xl p-4 border transition-all ${
            filters.status === 'active' ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-jet-black-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-jet-black-600">Ativas</span>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{stats.active || 0}</p>
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'trialing' ? '' : 'trialing' }))}
          className={`bg-white rounded-xl p-4 border transition-all ${
            filters.status === 'trialing' ? 'border-sky-300 ring-2 ring-sky-100' : 'border-jet-black-100 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-sky-500" />
            <span className="text-sm text-jet-black-600">Em Trial</span>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{stats.trialing || 0}</p>
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'past_due' ? '' : 'past_due' }))}
          className={`bg-white rounded-xl p-4 border transition-all ${
            filters.status === 'past_due' ? 'border-amber-300 ring-2 ring-amber-100' : 'border-jet-black-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-jet-black-600">Atrasadas</span>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{stats.past_due || 0}</p>
        </button>

        <button
          onClick={() => setFilters(prev => ({ ...prev, status: prev.status === 'canceled' ? '' : 'canceled' }))}
          className={`bg-white rounded-xl p-4 border transition-all ${
            filters.status === 'canceled' ? 'border-rose-300 ring-2 ring-rose-100' : 'border-jet-black-100 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-rose-500" />
            <span className="text-sm text-jet-black-600">Canceladas</span>
          </div>
          <p className="text-2xl font-bold text-jet-black-900">{stats.canceled || 0}</p>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-black-400" />
            <input
              type="text"
              placeholder="Buscar por empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <button
            onClick={() => setFilters(prev => ({ ...prev, expiring: !prev.expiring }))}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
              filters.expiring
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-jet-black-200 text-jet-black-700 hover:bg-jet-black-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Vencendo em 7 dias
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
              filters.plan
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'bg-white border-jet-black-200 text-jet-black-700 hover:bg-jet-black-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Plano
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
          <div className="mt-4 pt-4 border-t border-jet-black-100">
            <label className="block text-sm font-medium text-jet-black-700 mb-2">Plano</label>
            <select
              value={filters.plan}
              onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value }))}
              className="w-full sm:w-48 px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todos os planos</option>
              <option value="basic">Basico</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        )}
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-jet-black-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-jet-black-500">Carregando...</p>
          </div>
        ) : subscriptions.length > 0 ? (
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
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      MRR
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Inicio
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jet-black-50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-jet-black-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-jet-black-900">{sub.company_name}</p>
                        <p className="text-sm text-jet-black-500">{sub.company_email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPlanBadgeColor(sub.plan)}`}>
                          {sub.plan?.toUpperCase() || 'FREE'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sub.status)}
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeColor(sub.status)}`}>
                            {getStatusLabel(sub.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-jet-black-900">
                          R$ {(sub.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-jet-black-600">
                        {sub.start_date ? new Date(sub.start_date).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-5 py-4">
                        {sub.end_date ? (
                          <span className={`${
                            new Date(sub.end_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                              ? 'text-amber-600 font-medium'
                              : 'text-jet-black-600'
                          }`}>
                            {new Date(sub.end_date).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => navigate(`/superadmin/companies/${sub.company_id}`)}
                          className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
                          title="Ver empresa"
                        >
                          <ExternalLink className="w-4 h-4 text-jet-black-500" />
                        </button>
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
                  Mostrando {((pagination.page - 1) * pagination.per_page) + 1} a{' '}
                  {Math.min(pagination.page * pagination.per_page, pagination.total)} de{' '}
                  {pagination.total} assinaturas
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
            <CreditCard className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
            <p className="text-jet-black-500">Nenhuma assinatura encontrada</p>
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
