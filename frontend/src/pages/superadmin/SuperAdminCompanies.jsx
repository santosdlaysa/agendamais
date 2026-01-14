import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  Download,
  RefreshCw,
  X
} from 'lucide-react'
import { superAdminApi } from '../../services/superAdminApi'
import toast from 'react-hot-toast'

export default function SuperAdminCompanies() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: 10
  })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    plan: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [actionMenu, setActionMenu] = useState(null)

  useEffect(() => {
    fetchCompanies()
  }, [pagination.page, filters])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pagination.page === 1) {
        fetchCompanies()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        search: search || undefined,
        status: filters.status || undefined,
        plan: filters.plan || undefined
      }

      const response = await superAdminApi.getCompanies(params)
      setCompanies(response.data.companies || [])
      setPagination(prev => ({
        ...prev,
        ...response.data.pagination
      }))
    } catch (error) {
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async (companyId) => {
    try {
      await superAdminApi.suspendCompany(companyId, 'Suspensa pelo administrador')
      toast.success('Empresa suspensa com sucesso')
      fetchCompanies()
    } catch (error) {
      toast.error('Erro ao suspender empresa')
    }
    setActionMenu(null)
  }

  const handleActivate = async (companyId) => {
    try {
      await superAdminApi.activateCompany(companyId)
      toast.success('Empresa ativada com sucesso')
      fetchCompanies()
    } catch (error) {
      toast.error('Erro ao ativar empresa')
    }
    setActionMenu(null)
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

  const clearFilters = () => {
    setFilters({ status: '', plan: '' })
    setSearch('')
  }

  const hasActiveFilters = filters.status || filters.plan || search

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Empresas</h1>
          <p className="text-jet-black-500">Gerencie todas as empresas cadastradas na plataforma</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCompanies}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-jet-black-200 rounded-xl text-jet-black-700 hover:bg-jet-black-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-jet-black-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jet-black-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 placeholder-jet-black-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors ${
              hasActiveFilters
                ? 'bg-violet-50 border-violet-200 text-violet-700'
                : 'bg-white border-jet-black-200 text-jet-black-700 hover:bg-jet-black-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                {(filters.status ? 1 : 0) + (filters.plan ? 1 : 0)}
              </span>
            )}
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

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-jet-black-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="trialing">Trial</option>
                <option value="past_due">Pagamento Atrasado</option>
                <option value="canceled">Cancelado</option>
                <option value="suspended">Suspenso</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-jet-black-700 mb-2">Plano</label>
              <select
                value={filters.plan}
                onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value }))}
                className="w-full px-4 py-2.5 bg-jet-black-50 border-0 rounded-xl text-jet-black-900 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Todos os planos</option>
                <option value="basic">Basico</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl border border-jet-black-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-jet-black-500">Carregando...</p>
          </div>
        ) : companies.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-jet-black-50 border-b border-jet-black-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Proprietario
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
                      Criado em
                    </th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-jet-black-600 uppercase tracking-wider">
                      Acoes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jet-black-50">
                  {companies.map((company) => (
                    <tr key={company.id} className="hover:bg-jet-black-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                            {company.business_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-jet-black-900">{company.business_name}</p>
                            <p className="text-sm text-jet-black-500">/{company.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-jet-black-900">{company.owner_name}</p>
                        <p className="text-sm text-jet-black-500">{company.owner_email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPlanBadgeColor(company.subscription?.plan)}`}>
                          {company.subscription?.plan?.toUpperCase() || 'FREE'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeColor(company.subscription?.status)}`}>
                          {getStatusLabel(company.subscription?.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-jet-black-900">
                          R$ {(company.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-jet-black-600">
                        {new Date(company.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setActionMenu(actionMenu === company.id ? null : company.id)}
                            className="p-2 hover:bg-jet-black-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-jet-black-500" />
                          </button>

                          {actionMenu === company.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-jet-black-100 py-1 z-10">
                              <button
                                onClick={() => {
                                  navigate(`/superadmin/companies/${company.id}`)
                                  setActionMenu(null)
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-jet-black-700 hover:bg-jet-black-50"
                              >
                                <Eye className="w-4 h-4" />
                                Ver detalhes
                              </button>
                              {company.subscription?.status === 'suspended' ? (
                                <button
                                  onClick={() => handleActivate(company.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Ativar
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleSuspend(company.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                                >
                                  <Ban className="w-4 h-4" />
                                  Suspender
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-jet-black-50">
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => navigate(`/superadmin/companies/${company.id}`)}
                  className="p-4 hover:bg-jet-black-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        {company.business_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-jet-black-900">{company.business_name}</p>
                        <p className="text-sm text-jet-black-500">{company.owner_email}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-jet-black-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlanBadgeColor(company.subscription?.plan)}`}>
                      {company.subscription?.plan?.toUpperCase() || 'FREE'}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadgeColor(company.subscription?.status)}`}>
                      {getStatusLabel(company.subscription?.status)}
                    </span>
                    <span className="text-sm text-jet-black-500 ml-auto">
                      R$ {(company.mrr || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mes
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-5 py-4 border-t border-jet-black-100 flex items-center justify-between">
                <p className="text-sm text-jet-black-600">
                  Mostrando {((pagination.page - 1) * pagination.per_page) + 1} a{' '}
                  {Math.min(pagination.page * pagination.per_page, pagination.total)} de{' '}
                  {pagination.total} empresas
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
            <Building2 className="w-12 h-12 text-jet-black-300 mx-auto mb-3" />
            <p className="text-jet-black-500">Nenhuma empresa encontrada</p>
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
