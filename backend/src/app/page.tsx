import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { 
  Calendar, 
  Users, 
  UserCheck, 
  Briefcase, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '../ui/button'

// Função para buscar estatísticas do dashboard
const fetchDashboardStats = async () => {
  const response = await axios.get('/reports/dashboard')
  return response.data.stats
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar dashboard
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Não foi possível carregar as estatísticas. Tente novamente.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const today = stats?.today || {}
  const totals = stats?.totals || {}
  const upcomingAppointments = stats?.upcoming_appointments || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral do seu negócio hoje
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Agendamentos de hoje */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Agendamentos Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {today.total_appointments || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Agendados: {today.scheduled || 0}</span>
                <span>Concluídos: {today.completed || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Faturamento de hoje */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Faturamento Hoje
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {(today.revenue || 0).toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-600">
              Baseado em serviços concluídos
            </div>
          </div>
        </div>

        {/* Total de clientes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Clientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totals.clients || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-600">
              Clientes cadastrados
            </div>
          </div>
        </div>

        {/* Profissionais ativos */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Profissionais
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totals.professionals || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-600">
              Profissionais ativos
            </div>
          </div>
        </div>
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Próximos Agendamentos
          </h3>
          
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum agendamento próximo
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há agendamentos nas próximas 24 horas.
              </p>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.client?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {appointment.service?.name} - {appointment.professional?.name}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {appointment.appointment_date} às {appointment.start_time}
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge status={appointment.status} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Resumo de status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Status dos Agendamentos Hoje
          </h3>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{today.scheduled || 0}</div>
              <div className="text-sm text-gray-500">Agendados</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{today.completed || 0}</div>
              <div className="text-sm text-gray-500">Concluídos</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{today.cancelled || 0}</div>
              <div className="text-sm text-gray-500">Cancelados</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-semibold text-gray-900">{today.no_show || 0}</div>
              <div className="text-sm text-gray-500">Não Compareceu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const statusConfig = {
    scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Agendado' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Concluído' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelado' },
    no_show: { color: 'bg-yellow-100 text-yellow-800', text: 'Não Compareceu' },
  }

  const config = statusConfig[status] || statusConfig.scheduled

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  )
}

