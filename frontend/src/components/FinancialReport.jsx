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
    startDate: '2020-01-01', // Data ampla para mostrar todos por padrão
    endDate: '2030-12-31',   // Data ampla para mostrar todos por padrão
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
      toast.error('Erro ao carregar dados básicos')
    }
  }

  const loadReport = async () => {
    setLoading(true)
    try {
      // Primeiro tenta usar a API de relatório específica
      try {
        const data = await appointmentService.getFinancialReport(filters)
        setReport(data)
        return
      } catch (apiError) {
        // API de relatório não disponível, calculando manualmente
      }

      // Fallback: calcular relatório manualmente dos agendamentos
      // Se não há filtros específicos de prof/serviço, não aplicar para ver todos os dados
      const params = new URLSearchParams({
        per_page: '200' // Reduzir para evitar erro 500
      })

      // Só aplicar filtros de prof/serviço se estiverem definidos
      if (filters.professionalId && filters.professionalId !== '') {
        params.append('professional_id', filters.professionalId)
      }
      if (filters.serviceId && filters.serviceId !== '') {
        params.append('service_id', filters.serviceId)
      }

      let appointments = []

      try {
        const appointmentsRes = await api.get(`/appointments?${params}`)
        appointments = appointmentsRes.data.appointments || []
      } catch (fetchError) {
        // Erro ao buscar agendamentos, tentando alternativa

        // Fallback com parâmetros básicos se der erro
        try {
          const basicRes = await api.get('/appointments?per_page=100&status=completed')
          appointments = basicRes.data.appointments || []
        } catch (basicError) {
          appointments = []
        }
      }

      // Contar todos os agendamentos por status primeiro
      const statusCount = appointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1
        return acc
      }, {})

      // Primeiro, mostrar todos os agendamentos concluídos (sem filtro de data)
      const allCompletedAppointments = appointments.filter(apt => {
        // Verificar status
        if (apt.status !== 'completed') {
          return false
        }

        // Verificar preço
        const price = parseFloat(apt.price || 0)
        if (!apt.price || price <= 0) {
          return false
        }

        return true
      })

      // Depois aplicar filtro de data apenas se não for um período muito amplo
      const isWideRange = filters.startDate <= '2020-01-01' || filters.endDate >= '2030-01-01'

      let filteredAppointments

      if (isWideRange) {
        // Se é um período amplo, usar todos os concluídos
        filteredAppointments = allCompletedAppointments
      } else {
        // Aplicar filtro de data normalmente
        filteredAppointments = allCompletedAppointments.filter(apt => {
          try {
            const aptDate = new Date(apt.appointment_date)
            const startDate = new Date(filters.startDate)
            const endDate = new Date(filters.endDate + 'T23:59:59')

            // Verificar se as datas são válidas
            if (isNaN(aptDate.getTime()) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              return true // Em caso de erro, incluir o agendamento
            }

            return aptDate >= startDate && aptDate <= endDate
          } catch (dateError) {
            return true // Em caso de erro, incluir o agendamento
          }
        })
      }

      // Calcular resumo financeiro
      const totalRevenue = filteredAppointments.reduce((sum, apt) => sum + parseFloat(apt.price || 0), 0)
      const totalAppointments = filteredAppointments.length
      const averageTicket = totalAppointments > 0 ? totalRevenue / totalAppointments : 0

      // Breakdown por serviço
      const serviceBreakdown = filteredAppointments.reduce((acc, apt) => {
        const serviceName = apt.service?.name || 'Serviço não informado'
        if (!acc[serviceName]) {
          acc[serviceName] = { count: 0, total_revenue: 0 }
        }
        acc[serviceName].count++
        acc[serviceName].total_revenue += parseFloat(apt.price || 0)
        return acc
      }, {})

      // Breakdown por profissional
      const professionalBreakdown = filteredAppointments.reduce((acc, apt) => {
        const professionalName = apt.professional?.name || 'Profissional não informado'
        if (!acc[professionalName]) {
          acc[professionalName] = { count: 0, total_revenue: 0 }
        }
        acc[professionalName].count++
        acc[professionalName].total_revenue += parseFloat(apt.price || 0)
        return acc
      }, {})

      // Montar objeto do relatório
      const reportData = {
        financial_summary: {
          total_revenue: totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          total_appointments: totalAppointments,
          average_ticket: averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        },
        service_breakdown: Object.fromEntries(
          Object.entries(serviceBreakdown).map(([name, data]) => [
            name,
            {
              ...data,
              total_revenue_numeric: data.total_revenue,
              total_revenue: data.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
          ])
        ),
        professional_breakdown: Object.fromEntries(
          Object.entries(professionalBreakdown).map(([name, data]) => [
            name,
            {
              ...data,
              total_revenue_numeric: data.total_revenue,
              total_revenue: data.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
          ])
        )
      }

      setReport(reportData)
    } catch (error) {
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
      startDate: '2020-01-01', // Data ampla para mostrar todos
      endDate: '2030-12-31',   // Data ampla para mostrar todos
      professionalId: '',
      serviceId: ''
    })
  }

  const exportReport = () => {
    if (!report) return
    
    const csvData = [
      ['Relatório Financeiro - Agendar Mais'],
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-periwinkle-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Relatório Financeiro</h1>
          <p className="text-jet-black-600">Análise de receita e performance</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadReport}
            className="flex items-center px-4 py-2 border border-jet-black-300 text-jet-black-700 rounded-lg hover:bg-jet-black-50"
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
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Profissional
            </label>
            <select
              value={filters.professionalId}
              onChange={(e) => handleFilterChange('professionalId', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
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
            <label className="block text-sm font-medium text-jet-black-700 mb-1">
              Serviço
            </label>
            <select
              value={filters.serviceId}
              onChange={(e) => handleFilterChange('serviceId', e.target.value)}
              className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
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

        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setFilters({
                startDate: '2020-01-01', // Data muito antiga
                endDate: '2030-12-31',   // Data muito futura
                professionalId: '',
                serviceId: ''
              })
            }}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Ver todos os agendamentos concluídos
          </button>
          <button
            onClick={clearFilters}
            className="text-sm text-periwinkle-600 hover:text-periwinkle-800"
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
                  <p className="text-sm text-jet-black-600">Receita Total</p>
                  <p className="text-2xl font-bold text-jet-black-900">
                    R$ {report.financial_summary.total_revenue}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-3 bg-periwinkle-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-periwinkle-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-jet-black-600">Total de Agendamentos</p>
                  <p className="text-2xl font-bold text-jet-black-900">
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
                  <p className="text-sm text-jet-black-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-jet-black-900">
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
                <BarChart3 className="w-5 h-5 text-jet-black-600 mr-2" />
                <h2 className="text-lg font-semibold text-jet-black-900">Receita por Serviço</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(report.service_breakdown)
                  .sort(([,a], [,b]) => (b.total_revenue_numeric || 0) - (a.total_revenue_numeric || 0))
                  .map(([service, data]) => (
                  <div key={service} className="flex items-center justify-between p-4 bg-jet-black-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-jet-black-900">{service}</h3>
                      <p className="text-sm text-jet-black-600">{data.count} agendamentos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-jet-black-900">R$ {data.total_revenue}</p>
                      <p className="text-sm text-jet-black-600">
                        Média: R$ {((data.total_revenue_numeric || 0) / data.count).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                <Users className="w-5 h-5 text-jet-black-600 mr-2" />
                <h2 className="text-lg font-semibold text-jet-black-900">Receita por Profissional</h2>
              </div>
              
              <div className="space-y-4">
                {Object.entries(report.professional_breakdown)
                  .sort(([,a], [,b]) => (b.total_revenue_numeric || 0) - (a.total_revenue_numeric || 0))
                  .map(([professional, data]) => (
                  <div key={professional} className="flex items-center justify-between p-4 bg-jet-black-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-jet-black-900">{professional}</h3>
                      <p className="text-sm text-jet-black-600">{data.count} agendamentos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-jet-black-900">R$ {data.total_revenue}</p>
                      <p className="text-sm text-jet-black-600">
                        Média: R$ {((data.total_revenue_numeric || 0) / data.count).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
              <BarChart3 className="w-16 h-16 text-jet-black-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-jet-black-900 mb-2">
                Nenhum dado encontrado
              </h3>
              <p className="text-jet-black-600">
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