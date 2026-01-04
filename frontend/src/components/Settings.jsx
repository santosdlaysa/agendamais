import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Settings as SettingsIcon, Users, Shield, Lock, Loader2, Check, X } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const PERMISSIONS = [
  { id: 'manage_clients', name: 'Gerenciar Clientes', description: 'Criar, editar e excluir clientes' },
  { id: 'manage_professionals', name: 'Gerenciar Profissionais', description: 'Criar, editar e excluir profissionais' },
  { id: 'manage_services', name: 'Gerenciar Serviços', description: 'Criar, editar e excluir serviços' },
  { id: 'manage_appointments', name: 'Gerenciar Agendamentos', description: 'Criar, editar e excluir agendamentos' },
  { id: 'view_reports', name: 'Ver Relatórios', description: 'Acessar relatórios financeiros' },
  { id: 'manage_reminders', name: 'Gerenciar Lembretes', description: 'Configurar e enviar lembretes' },
  { id: 'manage_users', name: 'Gerenciar Usuários', description: 'Criar e gerenciar usuários do sistema' },
  { id: 'manage_permissions', name: 'Gerenciar Permissões', description: 'Alterar permissões de usuários' },
]

const ROLES = [
  { id: 'admin', name: 'Administrador', color: 'red' },
  { id: 'manager', name: 'Gerente', color: 'blue' },
  { id: 'employee', name: 'Funcionário', color: 'green' },
]

export default function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('permissions')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPermissions, setUserPermissions] = useState({})

  // Verificar se é admin
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      // Mock data para desenvolvimento
      setUsers([
        { id: 1, name: 'Admin', email: 'admin@teste.com', role: 'admin', permissions: PERMISSIONS.map(p => p.id) },
        { id: 2, name: 'Gerente', email: 'gerente@teste.com', role: 'manager', permissions: ['manage_clients', 'manage_appointments', 'view_reports'] },
        { id: 3, name: 'Funcionário', email: 'func@teste.com', role: 'employee', permissions: ['manage_appointments'] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = (selectedUser) => {
    setSelectedUser(selectedUser)
    // Carregar permissões do usuário
    const perms = {}
    PERMISSIONS.forEach(p => {
      perms[p.id] = selectedUser.permissions?.includes(p.id) || false
    })
    setUserPermissions(perms)
  }

  const handleTogglePermission = (permissionId) => {
    setUserPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }))
  }

  const handleSavePermissions = async () => {
    if (!selectedUser) return

    setSaving(true)
    try {
      const enabledPermissions = Object.entries(userPermissions)
        .filter(([_, enabled]) => enabled)
        .map(([id]) => id)

      await api.put(`/users/${selectedUser.id}/permissions`, {
        permissions: enabledPermissions
      })

      // Atualizar lista local
      setUsers(prev => prev.map(u =>
        u.id === selectedUser.id
          ? { ...u, permissions: enabledPermissions }
          : u
      ))

      toast.success('Permissões salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar permissões:', error)
      toast.error('Erro ao salvar permissões')
    } finally {
      setSaving(false)
    }
  }

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole })

      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ))

      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, role: newRole }))
      }

      toast.success('Função alterada com sucesso!')
    } catch (error) {
      console.error('Erro ao alterar função:', error)
      toast.error('Erro ao alterar função')
    }
  }

  // Se não for admin, mostrar mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Acesso Restrito</h2>
          <p className="text-red-700">
            Apenas administradores podem acessar as configurações do sistema.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Configurações
        </h1>
        <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('permissions')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'permissions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissões
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'permissions' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de Usuários */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Usuários</h3>
              <p className="text-sm text-gray-500">Selecione para editar</p>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedUser?.id === u.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    u.role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : u.role === 'manager'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {ROLES.find(r => r.id === u.role)?.name || u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Editor de Permissões */}
          <div className="md:col-span-2 bg-white rounded-lg shadow border">
            {selectedUser ? (
              <>
                <div className="p-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Permissões de {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleChangeRole(selectedUser.id, e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                    disabled={selectedUser.id === user?.id}
                  >
                    {ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {PERMISSIONS.map(permission => (
                    <label
                      key={permission.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={userPermissions[permission.id] || false}
                        onChange={() => handleTogglePermission(permission.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={selectedUser.role === 'admin'}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{permission.name}</p>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {selectedUser.role === 'admin' && (
                  <div className="px-4 pb-2">
                    <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      Administradores têm acesso total. As permissões não podem ser alteradas.
                    </p>
                  </div>
                )}

                <div className="p-4 border-t flex justify-end">
                  <button
                    onClick={handleSavePermissions}
                    disabled={saving || selectedUser.role === 'admin'}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Salvar Permissões
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Selecione um usuário para editar suas permissões</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Todos os Usuários</h3>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              + Novo Usuário
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Função</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissões</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : u.role === 'manager'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {ROLES.find(r => r.id === u.role)?.name || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {u.role === 'admin' ? 'Todas' : `${u.permissions?.length || 0} permissões`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setActiveTab('permissions')
                          handleSelectUser(u)
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
