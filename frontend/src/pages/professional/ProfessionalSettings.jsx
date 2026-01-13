import { useState, useEffect } from 'react'
import { useProfessionalAuth } from '../../contexts/ProfessionalAuthContext'
import { professionalApi } from '../../services/professionalApi'
import toast from 'react-hot-toast'
import {
  Settings,
  Clock,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react'

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terca-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sabado' }
]

export default function ProfessionalSettings() {
  const { professional, changePassword } = useProfessionalAuth()
  const [activeTab, setActiveTab] = useState('hours')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Working Hours State
  const [workingHours, setWorkingHours] = useState([])

  // Blocked Dates State
  const [blockedDates, setBlockedDates] = useState([])
  const [newBlockedDate, setNewBlockedDate] = useState({
    date: '',
    reason: ''
  })

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const [hoursData, datesData] = await Promise.all([
        professionalApi.getWorkingHours(),
        professionalApi.getBlockedDates()
      ])
      setWorkingHours(hoursData.working_hours || [])
      setBlockedDates(datesData.blocked_dates || [])
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error)
      toast.error('Erro ao carregar configuracoes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSaveWorkingHours = async () => {
    setSaving(true)
    try {
      await professionalApi.updateWorkingHours({ working_hours: workingHours })
      toast.success('Horarios salvos com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar horarios')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleDay = (dayValue) => {
    const existingIndex = workingHours.findIndex(h => h.day_of_week === dayValue)

    if (existingIndex >= 0) {
      // Remove day
      setWorkingHours(workingHours.filter((_, i) => i !== existingIndex))
    } else {
      // Add day with default hours
      setWorkingHours([
        ...workingHours,
        {
          day_of_week: dayValue,
          start_time: '09:00',
          end_time: '18:00',
          break_start: null,
          break_end: null
        }
      ])
    }
  }

  const handleUpdateDayHours = (dayValue, field, value) => {
    setWorkingHours(workingHours.map(h =>
      h.day_of_week === dayValue ? { ...h, [field]: value } : h
    ))
  }

  const handleAddBlockedDate = async () => {
    if (!newBlockedDate.date) {
      toast.error('Selecione uma data')
      return
    }

    setSaving(true)
    try {
      await professionalApi.blockDate(newBlockedDate)
      toast.success('Data bloqueada com sucesso!')
      setNewBlockedDate({ date: '', reason: '' })
      fetchSettings()
    } catch (error) {
      toast.error('Erro ao bloquear data')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveBlockedDate = async (id) => {
    try {
      await professionalApi.unblockDate(id)
      toast.success('Bloqueio removido!')
      fetchSettings()
    } catch (error) {
      toast.error('Erro ao remover bloqueio')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas nao coincidem')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres')
      return
    }

    setSaving(true)
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword)
      if (result.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')
  }

  const tabs = [
    { id: 'hours', label: 'Horarios', icon: Clock },
    { id: 'blocked', label: 'Bloqueios', icon: Calendar },
    { id: 'password', label: 'Senha', icon: Lock }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-emerald-600" />
          <h1 className="text-xl font-bold text-jet-black-900">Configuracoes</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-jet-black-500 hover:text-jet-black-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Working Hours Tab */}
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Configure os dias e horarios que voce esta disponivel para atendimento.
                  Alteracoes aqui podem precisar de aprovacao do administrador.
                </p>
              </div>

              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const dayHours = workingHours.find(h => h.day_of_week === day.value)
                  const isActive = !!dayHours

                  return (
                    <div
                      key={day.value}
                      className={`p-4 rounded-xl border ${
                        isActive ? 'bg-emerald-50 border-emerald-200' : 'bg-jet-black-50 border-jet-black-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => handleToggleDay(day.value)}
                            className="w-5 h-5 rounded border-jet-black-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className={`font-medium ${isActive ? 'text-emerald-700' : 'text-jet-black-600'}`}>
                            {day.label}
                          </span>
                        </label>

                        {isActive && (
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={dayHours.start_time || '09:00'}
                                onChange={(e) => handleUpdateDayHours(day.value, 'start_time', e.target.value)}
                                className="px-2 py-1 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                              <span className="text-jet-black-500">ate</span>
                              <input
                                type="time"
                                value={dayHours.end_time || '18:00'}
                                onChange={(e) => handleUpdateDayHours(day.value, 'end_time', e.target.value)}
                                className="px-2 py-1 border border-emerald-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={handleSaveWorkingHours}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Salvar Horarios
              </button>
            </div>
          )}

          {/* Blocked Dates Tab */}
          {activeTab === 'blocked' && (
            <div className="space-y-6">
              {/* Add New Block */}
              <div className="p-4 bg-jet-black-50 rounded-xl">
                <h3 className="font-medium text-jet-black-900 mb-4">Bloquear Nova Data</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="date"
                    value={newBlockedDate.date}
                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, date: e.target.value })}
                    className="px-3 py-2 border border-jet-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Motivo (opcional)"
                    value={newBlockedDate.reason}
                    onChange={(e) => setNewBlockedDate({ ...newBlockedDate, reason: e.target.value })}
                    className="flex-1 px-3 py-2 border border-jet-black-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleAddBlockedDate}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Bloquear
                  </button>
                </div>
              </div>

              {/* Blocked Dates List */}
              <div>
                <h3 className="font-medium text-jet-black-900 mb-4">Datas Bloqueadas</h3>
                {blockedDates.length === 0 ? (
                  <p className="text-center py-8 text-jet-black-500">
                    Nenhuma data bloqueada
                  </p>
                ) : (
                  <div className="space-y-2">
                    {blockedDates.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-medium text-jet-black-900">
                              {formatDate(block.date)}
                            </p>
                            {block.reason && (
                              <p className="text-sm text-jet-black-500">{block.reason}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveBlockedDate(block.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-jet-black-700">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 pr-12 border border-jet-black-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-jet-black-400"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-jet-black-700">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 pr-12 border border-jet-black-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-jet-black-400"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-jet-black-700">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 pr-12 border border-jet-black-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-jet-black-400"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-xl transition-colors"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
                Alterar Senha
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
