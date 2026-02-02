import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Settings as SettingsIcon, Users, Shield, Lock, Loader2, Check, Building2, Link, Copy, ExternalLink, Calendar, Clock, Bell, UserCheck, Mail, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
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
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') || 'business'
  const [activeTab, setActiveTab] = useState(tabFromUrl)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPermissions, setUserPermissions] = useState({})

  // Estado para Portal do Profissional
  const [professionals, setProfessionals] = useState([])
  const [loadingProfessionals, setLoadingProfessionals] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState(null)
  const [sendingInvite, setSendingInvite] = useState(false)

  // Atualizar tab quando URL mudar
  useEffect(() => {
    const tab = searchParams.get('tab') || 'business'
    setActiveTab(tab)
  }, [searchParams])

  // Atualizar URL quando tab mudar
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  // Estado da empresa
  const [businessData, setBusinessData] = useState({
    business_name: '',
    slug: '',
    business_phone: '',
    business_address: '',
    business_logo: '',
    online_booking_enabled: true
  })
  const [savingBusiness, setSavingBusiness] = useState(false)

  // Estado das configurações de agendamento
  const [bookingSettings, setBookingSettings] = useState({
    min_advance_hours: 2,
    max_advance_days: 30,
    slot_interval: 30,
    start_hour: 8,
    end_hour: 18,
    allow_cancellation: true,
    cancellation_min_hours: 2,
    require_confirmation: false
  })
  const [savingBooking, setSavingBooking] = useState(false)

  // Verificar se é admin
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchBusinessData()
    if (isAdmin) {
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [isAdmin])

  const fetchBusinessData = async () => {
    try {
      const response = await api.get('/auth/business')
      const data = response.data.business || response.data
      setBusinessData({
        business_name: data.business_name || '',
        slug: data.slug || '',
        business_phone: data.business_phone || '',
        business_address: data.business_address || '',
        business_logo: data.business_logo || '',
        online_booking_enabled: data.online_booking_enabled ?? true
      })
      // Carregar configurações de booking se existirem
      if (data.booking_settings) {
        setBookingSettings(prev => ({
          ...prev,
          ...data.booking_settings
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error)
      // Fallback para /auth/me se /auth/business não existir
      try {
        const response = await api.get('/auth/me')
        const userData = response.data.user
        setBusinessData({
          business_name: userData.business_name || userData.name || '',
          slug: userData.slug || '',
          business_phone: userData.business_phone || '',
          business_address: userData.business_address || '',
          business_logo: userData.business_logo || '',
          online_booking_enabled: userData.online_booking_enabled ?? true
        })
        if (userData.booking_settings) {
          setBookingSettings(prev => ({
            ...prev,
            ...userData.booking_settings
          }))
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      }
    }
  }

  const handleSaveBookingSettings = async () => {
    setSavingBooking(true)
    try {
      await api.put('/auth/business/booking-settings', bookingSettings)
      toast.success('Configurações de agendamento salvas!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error(error.response?.data?.error || 'Erro ao salvar configurações')
    } finally {
      setSavingBooking(false)
    }
  }

  const handleSaveBusiness = async () => {
    if (!businessData.slug) {
      toast.error('O slug é obrigatório para o link de agendamento')
      return
    }

    setSavingBusiness(true)
    try {
      const response = await api.put('/auth/business', businessData)
      toast.success('Dados da empresa salvos com sucesso!')
      // Atualizar com dados retornados
      if (response.data.business) {
        setBusinessData(response.data.business)
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      toast.error(error.response?.data?.error || 'Erro ao salvar dados da empresa')
    } finally {
      setSavingBusiness(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const getBookingUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/agendar/${businessData.slug}`
  }

  const copyBookingLink = () => {
    navigator.clipboard.writeText(getBookingUrl())
    toast.success('Link copiado!')
  }

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

  // Funções do Portal do Profissional
  const fetchProfessionals = async () => {
    setLoadingProfessionals(true)
    try {
      const response = await api.get('/professionals')
      setProfessionals(response.data.professionals || response.data || [])
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
    } finally {
      setLoadingProfessionals(false)
    }
  }

  const handleSendInvite = async () => {
    if (!selectedProfessional || !inviteEmail) {
      toast.error('Selecione um profissional e informe o email')
      return
    }

    setSendingInvite(true)
    try {
      await api.post(`/professionals/${selectedProfessional.id}/invite`, {
        email: inviteEmail
      })
      toast.success('Convite enviado com sucesso!')
      setInviteEmail('')
      setSelectedProfessional(null)
      fetchProfessionals() // Recarregar lista
    } catch (error) {
      console.error('Erro ao enviar convite:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar convite')
    } finally {
      setSendingInvite(false)
    }
  }

  const getProfessionalPortalUrl = () => {
    const baseUrl = window.location.origin
    return `${baseUrl}/#/profissional/login`
  }

  const copyProfessionalPortalLink = () => {
    navigator.clipboard.writeText(getProfessionalPortalUrl())
    toast.success('Link copiado!')
  }

  // Carregar profissionais quando a aba for selecionada
  useEffect(() => {
    if (activeTab === 'professional-portal') {
      fetchProfessionals()
    }
  }, [activeTab])

  // Se não for admin e tentar acessar abas restritas, redirecionar para empresa
  useEffect(() => {
    if (!isAdmin && (activeTab === 'permissions' || activeTab === 'users')) {
      handleTabChange('business')
    }
  }, [activeTab, isAdmin])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-periwinkle-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-jet-black-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Configurações
        </h1>
        <p className="text-jet-black-600">Gerencie usuários e permissões do sistema</p>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => handleTabChange('business')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'business'
                ? 'border-periwinkle-600 text-periwinkle-600'
                : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Empresa
            </div>
          </button>
          <button
            onClick={() => handleTabChange('booking')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'booking'
                ? 'border-periwinkle-600 text-periwinkle-600'
                : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agendamento Online
            </div>
          </button>
          <button
            onClick={() => handleTabChange('professional-portal')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'professional-portal'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Portal do Profissional
            </div>
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => handleTabChange('permissions')}
                className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'permissions'
                    ? 'border-periwinkle-600 text-periwinkle-600'
                    : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Permissões
                </div>
              </button>
              <button
                onClick={() => handleTabChange('users')}
                className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-periwinkle-600 text-periwinkle-600'
                    : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Usuários
                </div>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          {/* Link de Agendamento */}
          {businessData.slug && (
            <div className="bg-gradient-to-r from-periwinkle-600 to-periwinkle-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-5 h-5" />
                <h3 className="font-semibold">Link de Agendamento Online</h3>
              </div>
              <p className="text-periwinkle-100 text-sm mb-4">
                Compartilhe este link com seus clientes para que eles agendem diretamente
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getBookingUrl()}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50"
                />
                <button
                  onClick={copyBookingLink}
                  className="px-4 py-2 bg-white text-periwinkle-600 rounded-lg font-medium hover:bg-periwinkle-50 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
                <a
                  href={getBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Dados da Empresa */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-periwinkle-600" />
              Dados da Empresa
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Nome da Empresa */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={businessData.business_name}
                  onChange={(e) => {
                    setBusinessData(prev => ({
                      ...prev,
                      business_name: e.target.value,
                      slug: prev.slug || generateSlug(e.target.value)
                    }))
                  }}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                  placeholder="Ex: Barbearia do João"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Slug (URL) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-jet-black-300 bg-jet-black-50 text-jet-black-500 text-sm">
                    /agendar/
                  </span>
                  <input
                    type="text"
                    value={businessData.slug}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                    className="flex-1 px-4 py-2 border border-jet-black-300 rounded-r-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                    placeholder="minha-empresa"
                  />
                </div>
                <p className="text-xs text-jet-black-500 mt-1">
                  Este será o link que seus clientes usarão para agendar
                </p>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={businessData.business_phone}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, business_phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                  placeholder="(00) 00000-0000"
                />
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  value={businessData.business_address}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, business_address: e.target.value }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              {/* Logo URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  URL do Logo
                </label>
                <input
                  type="url"
                  value={businessData.business_logo}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, business_logo: e.target.value }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>

              {/* Agendamento Online */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={businessData.online_booking_enabled}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, online_booking_enabled: e.target.checked }))}
                    className="w-5 h-5 rounded border-jet-black-300 text-periwinkle-600 focus:ring-periwinkle-500"
                  />
                  <div>
                    <span className="font-medium text-jet-black-900">Habilitar agendamento online</span>
                    <p className="text-sm text-jet-black-500">Permite que clientes agendem pelo link público</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="mt-6 pt-6 border-t flex justify-end">
              <button
                onClick={handleSaveBusiness}
                disabled={savingBusiness}
                className="px-6 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {savingBusiness ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Salvar Dados
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="space-y-6">
          {/* Configurações de Horário */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-periwinkle-600" />
              Horários de Funcionamento
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Hora de Início */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Horário de Início
                </label>
                <select
                  value={bookingSettings.start_hour}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, start_hour: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                  ))}
                </select>
                <p className="text-xs text-jet-black-500 mt-1">Horário de abertura para agendamentos</p>
              </div>

              {/* Hora de Fim */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Horário de Término
                </label>
                <select
                  value={bookingSettings.end_hour}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, end_hour: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                  ))}
                </select>
                <p className="text-xs text-jet-black-500 mt-1">Horário de fechamento para agendamentos</p>
              </div>

              {/* Intervalo entre slots */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Intervalo entre Horários
                </label>
                <select
                  value={bookingSettings.slot_interval}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, slot_interval: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                >
                  <option value={15}>15 minutos</option>
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>1 hora</option>
                </select>
                <p className="text-xs text-jet-black-500 mt-1">Duração padrão de cada slot de agendamento</p>
              </div>
            </div>
          </div>

          {/* Regras de Agendamento */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-periwinkle-600" />
              Regras de Agendamento
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Antecedência mínima */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Antecedência Mínima (horas)
                </label>
                <input
                  type="number"
                  min="0"
                  max="72"
                  value={bookingSettings.min_advance_hours}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, min_advance_hours: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                />
                <p className="text-xs text-jet-black-500 mt-1">
                  Tempo mínimo antes do horário para agendar (ex: 2h antes)
                </p>
              </div>

              {/* Antecedência máxima */}
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Antecedência Máxima (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={bookingSettings.max_advance_days}
                  onChange={(e) => setBookingSettings(prev => ({ ...prev, max_advance_days: parseInt(e.target.value) || 30 }))}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                />
                <p className="text-xs text-jet-black-500 mt-1">
                  Quantos dias no futuro o cliente pode agendar
                </p>
              </div>
            </div>
          </div>

          {/* Cancelamento */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-periwinkle-600" />
              Cancelamento e Confirmação
            </h3>

            <div className="space-y-6">
              {/* Permitir cancelamento */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingSettings.allow_cancellation}
                    onChange={(e) => setBookingSettings(prev => ({ ...prev, allow_cancellation: e.target.checked }))}
                    className="w-5 h-5 rounded border-jet-black-300 text-periwinkle-600 focus:ring-periwinkle-500"
                  />
                  <div>
                    <span className="font-medium text-jet-black-900">Permitir cancelamento online</span>
                    <p className="text-sm text-jet-black-500">Clientes podem cancelar pelo link de consulta</p>
                  </div>
                </label>
              </div>

              {/* Antecedência para cancelar */}
              {bookingSettings.allow_cancellation && (
                <div className="ml-8">
                  <label className="block text-sm font-medium text-jet-black-700 mb-2">
                    Antecedência mínima para cancelar (horas)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="72"
                    value={bookingSettings.cancellation_min_hours}
                    onChange={(e) => setBookingSettings(prev => ({ ...prev, cancellation_min_hours: parseInt(e.target.value) || 0 }))}
                    className="w-full max-w-xs px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-periwinkle-500 focus:border-periwinkle-500"
                  />
                  <p className="text-xs text-jet-black-500 mt-1">
                    Ex: 2h significa que só pode cancelar até 2h antes do horário
                  </p>
                </div>
              )}

              {/* Exigir confirmação */}
              <div className="pt-4 border-t">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bookingSettings.require_confirmation}
                    onChange={(e) => setBookingSettings(prev => ({ ...prev, require_confirmation: e.target.checked }))}
                    className="w-5 h-5 rounded border-jet-black-300 text-periwinkle-600 focus:ring-periwinkle-500"
                  />
                  <div>
                    <span className="font-medium text-jet-black-900">Exigir confirmação do agendamento</span>
                    <p className="text-sm text-jet-black-500">Cliente recebe email/SMS para confirmar o agendamento</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveBookingSettings}
              disabled={savingBooking}
              className="px-6 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {savingBooking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'professional-portal' && (
        <div className="space-y-6">
          {/* Link do Portal */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5" />
              <h3 className="font-semibold">Portal do Profissional</h3>
            </div>
            <p className="text-emerald-100 text-sm mb-4">
              Compartilhe este link com seus profissionais para que eles acessem suas agendas individuais
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={getProfessionalPortalUrl()}
                readOnly
                className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50"
              />
              <button
                onClick={copyProfessionalPortalLink}
                className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
              <a
                href={getProfessionalPortalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Como Funciona */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              Como Funciona
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-jet-black-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <h4 className="font-medium text-jet-black-900 mb-1">Envie o Convite</h4>
                <p className="text-sm text-jet-black-600">
                  Selecione um profissional e envie um convite por email
                </p>
              </div>
              <div className="p-4 bg-jet-black-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-emerald-600 font-bold">2</span>
                </div>
                <h4 className="font-medium text-jet-black-900 mb-1">Profissional Cria Senha</h4>
                <p className="text-sm text-jet-black-600">
                  O profissional recebe o email e cria sua senha de acesso
                </p>
              </div>
              <div className="p-4 bg-jet-black-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-emerald-600 font-bold">3</span>
                </div>
                <h4 className="font-medium text-jet-black-900 mb-1">Acessa o Portal</h4>
                <p className="text-sm text-jet-black-600">
                  Com a senha criada, o profissional acessa sua agenda pessoal
                </p>
              </div>
            </div>
          </div>

          {/* Enviar Convite */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-semibold text-jet-black-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              Enviar Convite
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Selecione o Profissional
                </label>
                <select
                  value={selectedProfessional?.id || ''}
                  onChange={(e) => {
                    const prof = professionals.find(p => p.id === parseInt(e.target.value))
                    setSelectedProfessional(prof || null)
                    if (prof?.email) setInviteEmail(prof.email)
                  }}
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Selecione...</option>
                  {professionals.map(prof => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name} - {prof.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-jet-black-700 mb-2">
                  Email do Profissional
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@profissional.com"
                  className="w-full px-4 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleSendInvite}
              disabled={sendingInvite || !selectedProfessional || !inviteEmail}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendingInvite ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Enviar Convite
                </>
              )}
            </button>
          </div>

          {/* Lista de Profissionais */}
          <div className="bg-white rounded-xl shadow border">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-jet-black-900">Status dos Profissionais</h3>
              <button
                onClick={fetchProfessionals}
                disabled={loadingProfessionals}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {loadingProfessionals ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>

            {loadingProfessionals ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              </div>
            ) : professionals.length === 0 ? (
              <div className="p-8 text-center text-jet-black-500">
                <UserCheck className="w-12 h-12 mx-auto mb-3 text-jet-black-300" />
                <p>Nenhum profissional cadastrado</p>
                <button
                  onClick={() => navigate('/professionals/new')}
                  className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Cadastrar profissional
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-jet-black-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Profissional</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Funcao</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Status Portal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {professionals.map(prof => (
                      <tr key={prof.id} className="hover:bg-jet-black-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: prof.color || '#10B981' }}
                            >
                              <span className="text-white text-sm font-medium">
                                {prof.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-jet-black-900">{prof.name}</p>
                              <p className="text-sm text-jet-black-500">{prof.email || 'Sem email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-jet-black-600">{prof.role}</td>
                        <td className="px-4 py-3">
                          {prof.has_portal_access ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              Ativo
                            </span>
                          ) : prof.invite_pending ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              <Clock className="w-3 h-3" />
                              Convite Enviado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-jet-black-100 text-jet-black-600 text-xs rounded-full">
                              <XCircle className="w-3 h-3" />
                              Sem acesso
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!prof.has_portal_access && (
                            <button
                              onClick={() => {
                                setSelectedProfessional(prof)
                                setInviteEmail(prof.email || '')
                              }}
                              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                            >
                              Enviar Convite
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de Usuários */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-jet-black-900">Usuários</h3>
              <p className="text-sm text-jet-black-500">Selecione para editar</p>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full p-4 text-left hover:bg-jet-black-50 transition-colors ${
                    selectedUser?.id === u.id ? 'bg-periwinkle-50' : ''
                  }`}
                >
                  <p className="font-medium text-jet-black-900">{u.name}</p>
                  <p className="text-sm text-jet-black-500">{u.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    u.role === 'admin'
                      ? 'bg-red-100 text-red-700'
                      : u.role === 'manager'
                      ? 'bg-periwinkle-100 text-periwinkle-700'
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
                    <h3 className="font-semibold text-jet-black-900">
                      Permissões de {selectedUser.name}
                    </h3>
                    <p className="text-sm text-jet-black-500">{selectedUser.email}</p>
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
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-jet-black-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={userPermissions[permission.id] || false}
                        onChange={() => handleTogglePermission(permission.id)}
                        className="mt-1 w-4 h-4 rounded border-jet-black-300 text-periwinkle-600 focus:ring-periwinkle-500"
                        disabled={selectedUser.role === 'admin'}
                      />
                      <div>
                        <p className="font-medium text-jet-black-900">{permission.name}</p>
                        <p className="text-sm text-jet-black-500">{permission.description}</p>
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
                    className="px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <div className="p-8 text-center text-jet-black-500">
                <Shield className="w-12 h-12 mx-auto mb-3 text-jet-black-300" />
                <p>Selecione um usuário para editar suas permissões</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-jet-black-900">Todos os Usuários</h3>
            <button className="px-4 py-2 bg-periwinkle-600 hover:bg-periwinkle-700 text-white rounded-lg text-sm font-medium transition-colors">
              + Novo Usuário
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-jet-black-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Função</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Permissões</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-jet-black-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-jet-black-50">
                    <td className="px-4 py-3 font-medium text-jet-black-900">{u.name}</td>
                    <td className="px-4 py-3 text-jet-black-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        u.role === 'admin'
                          ? 'bg-red-100 text-red-700'
                          : u.role === 'manager'
                          ? 'bg-periwinkle-100 text-periwinkle-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {ROLES.find(r => r.id === u.role)?.name || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-jet-black-600">
                      {u.role === 'admin' ? 'Todas' : `${u.permissions?.length || 0} permissões`}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setActiveTab('permissions')
                          handleSelectUser(u)
                        }}
                        className="text-periwinkle-600 hover:text-periwinkle-800 text-sm font-medium"
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
