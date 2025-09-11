import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3, 
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'
import { appointmentService } from '../utils/api'
import api from '../utils/api'
import toast from 'react-hot-toast'

const FinancialReport = () => {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0].replace(/-\d{2}$/, '-01'), // First day of current month
    endDate: new Date().toISOString().split('T')[0], // Today
    professionalId: '',
    serviceId: ''
  })
  const [professionals, setProfessionals] = useState([])
  const [services, setServices] = useState([])

  useEffect(() => {
    loadBasicData()
    loadReport()
  }, [])

  useEffect(() => {
    loadReport()
  }, [filters])

  const loadBasicData = async () => {
    try {
      const [professionalsResponse, servicesResponse] = await Promise.all([
        api.get('/professionals?active_only=true'),
        api.get('/services')
      ])
      
      setProfessionals(professionalsResponse.data.professionals || [])
      setServices(servicesResponse.data.services || [])
    } catch (error) {
      console.error('Erro ao carregar dados básicos:', error)
      toast.error('Erro ao carregar dados básicos')
    }
  }

  const loadReport = async () => {
    setLoading(true)
    try {
      const data = await appointmentService.getFinancialReport(filters)
      setReport(data)
    } catch (error) {
      console.error('Erro ao carregar relatório:', error)
      toast.error('Erro ao carregar relatório financeiro')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      startDate: new Date().toISOString().split('T')[0].replace(/-\d{2}$/, '-01'),
      endDate: new Date().toISOString().split('T')[0],
      professionalId: '',
      serviceId: ''
    })
  }

  const exportReport = () => {
    if (!report) return
    
    const csvData = [
      ['Relatório Financeiro - AgendaMais'],
      ['Período', `${filters.startDate} a ${filters.endDate}`],
      [''],
      ['RESUMO FINANCEIRO'],
      ['Receita Total', `R$ ${report.financial_summary.total_revenue}`],
      ['Total de Agendamentos', report.financial_summary.total_appointments],
      ['Ticket Médio', `R$ ${report.financial_summary.average_ticket}`],
      [''],
      ['BREAKDOWN POR SERVIÇO'],
      ['Serviço', 'Quantidade', 'Receita Total'],
      ...Object.entries(report.service_breakdown || {}).map(([service, data]) => [
        service,
        data.count,
        `R$ ${data.total_revenue}`
      ]),
      [''],
      ['BREAKDOWN POR PROFISSIONAL'],
      ['Profissional', 'Quantidade', 'Receita Total'],
      ...Object.entries(report.professional_breakdown || {}).map(([professional, data]) => [
        professional,
        data.count,
        `R$ ${data.total_revenue}`
      ])
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-financeiro-${filters.startDate}-${filters.endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Relatório exportado com sucesso!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatório Financeiro</h1>
          <p className="text-gray-600">Análise de receita e performance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadReport}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </button>
          <button
            onClick={exportReport}
            disabled={!report}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profissional
            </label>
            <select
              value={filters.professionalId}
              onChange={(e) => handleFilterChange('professionalId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os profissionais</option>
              {professionals.map((professional) => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serviço
            </label>
            <select
              value={filters.serviceId}
              onChange={(e) => handleFilterChange('serviceId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os serviços</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {report.financial_summary.total_revenue}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {report.financial_summary.total_appointments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {report.financial_summary.average_ticket}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown by Service */}
          {report.service_breakdown && Object.keys(report.service_breakdown).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-6">
                <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Receita por Serviço</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(report.service_breakdown)
                  .sort(([,a], [,b]) => b.total_revenue - a.total_revenue)
                  .map(([service, data]) => (
                  <div key={service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{service}</h3>
                      <p className="text-sm text-gray-600">{data.count} agendamentos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {data.total_revenue}</p>
                      <p className="text-sm text-gray-600">
                        Média: R$ {(data.total_revenue / data.count).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown by Professional */}
          {report.professional_breakdown && Object.keys(report.professional_breakdown).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-6">
                <Users className="w-5 h-5 text-gray-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Receita por Profissional</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(report.professional_breakdown)
                  .sort(([,a], [,b]) => b.total_revenue - a.total_revenue)
                  .map(([professional, data]) => (
                  <div key={professional} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{professional}</h3>
                      <p className="text-sm text-gray-600">{data.count} agendamentos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">R$ {data.total_revenue}</p>
                      <p className="text-sm text-gray-600">
                        Média: R$ {(data.total_revenue / data.count).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {report.financial_summary.total_appointments === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum dado encontrado
              </h3>
              <p className="text-gray-600">
                Não há agendamentos concluídos no período selecionado.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FinancialReport