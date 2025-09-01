
import { useState } from 'react'
import { Users, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('')

  // Dados mockados para demonstração
  const mockClients = [
    {
      id: 1,
      name: 'Maria Silva',
      phone: '(11) 99999-9999',
      email: 'maria@email.com',
      totalAppointments: 15,
      lastAppointment: '2024-08-20'
    },
    {
      id: 2,
      name: 'João Santos',
      phone: '(11) 88888-8888',
      email: 'joao@email.com',
      totalAppointments: 8,
      lastAppointment: '2024-08-18'
    },
    {
      id: 3,
      name: 'Ana Costa',
      phone: '(11) 77777-7777',
      email: 'ana@email.com',
      totalAppointments: 22,
      lastAppointment: '2024-08-25'
    }
  ]

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Clientes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus clientes cadastrados
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <div className="-my-5 divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm 
                      ? 'Tente ajustar os termos de busca.' 
                      : 'Comece cadastrando seu primeiro cliente.'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="mt-6">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Cliente
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                filteredClients.map((client) => (
                  <div key={client.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {client.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {client.phone} • {client.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {client.totalAppointments} agendamentos
                          </p>
                          <p className="text-sm text-gray-500">
                            Último: {new Date(client.lastAppointment).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Clientes
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockClients.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Clientes Ativos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mockClients.filter(c => new Date(c.lastAppointment) > new Date('2024-08-01')).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Média de Agendamentos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Math.round(mockClients.reduce((acc, c) => acc + c.totalAppointments, 0) / mockClients.length)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

