import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Mail,
  Save,
  ArrowLeft,
  User,
  TestTube,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from './ui/button'
import api from '../utils/api'

export default function ReminderSettings() {
  const navigate = useNavigate()
  const [professionals, setProfessionals] = useState([])
  const [selectedProfessional, setSelectedProfessional] = useState('')
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState({ whatsapp: false, sms: false })
  const [testResults, setTestResults] = useState({})

  useEffect(() => {
    fetchProfessionals()
  }, [])

  useEffect(() => {
    if (selectedProfessional) {
      fetchSettings()
    }
  }, [selectedProfessional])

  const fetchProfessionals = async () => {
    try {
      const response = await api.get('/professionals')
      setProfessionals(response.data.professionals || [])
      if (response.data.professionals && response.data.professionals.length > 0) {
        setSelectedProfessional(response.data.professionals[0].id.toString())
      }
    } catch (error) {
      console.error('Erro ao carregar profissionais:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await api.get(`/reminders/settings?professional_id=${selectedProfessional}`)
      setSettings(response.data.settings || [])
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const updateSetting = (reminderType, field, value) => {
    setSettings(prev => {
      const updated = [...prev]
      const index = updated.findIndex(s => s.reminder_type === reminderType)

      if (index >= 0) {
        updated[index] = { ...updated[index], [field]: value }
      } else {
        updated.push({
          reminder_type: reminderType,
          enabled: field === 'enabled' ? value : false,
          hours_before: field === 'hours_before' ? value : 24,
          custom_message: field === 'custom_message' ? value : null
        })
      }

      return updated
    })
  }

  const getSetting = (reminderType, field, defaultValue = null) => {
    const setting = settings.find(s => s.reminder_type === reminderType)
    return setting ? setting[field] : defaultValue
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      await api.put('/reminders/settings', {
        professional_id: parseInt(selectedProfessional),
        settings: settings
      })
      alert('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async (type) => {
    try {
      setTesting(prev => ({ ...prev, [type]: true }))
      const response = await api.post(`/reminders/test/${type}`)
      setTestResults(prev => ({
        ...prev,
        [type]: {
          success: response.data.success,
          message: response.data.message
        }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [type]: {
          success: false,
          message: error.response?.data?.message || 'Erro no teste'
        }
      }))
    } finally {
      setTesting(prev => ({ ...prev, [type]: false }))
    }
  }

  const selectedProfessionalName = professionals.find(p => p.id.toString() === selectedProfessional)?.name || 'Selecione um profissional'

  const defaultMessage = `Olá {client_name}!

🗓️ *Lembrete de Agendamento*

Você tem um agendamento marcado para:
📅 Data: {date}
⏰ Horário: {time}
👨‍⚕️ Profissional: {professional_name}
💼 Serviço: {service_name}

Aguardamos você!`

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
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/reminders')}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações de Lembretes</h1>
            <p className="text-gray-600">Configure os lembretes automáticos por profissional</p>
          </div>
        </div>
      </div>

      {/* Professional Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          <User className="h-5 w-5 text-gray-400" />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Profissional
            </label>
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {professionals.map(professional => (
                <option key={professional.id} value={professional.id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedProfessional && (
        <>
          {/* WhatsApp Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-medium text-gray-900">WhatsApp</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => testConnection('whatsapp')}
                  disabled={testing.whatsapp}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <TestTube className="h-4 w-4" />
                  <span>{testing.whatsapp ? 'Testando...' : 'Testar'}</span>
                </Button>
                {testResults.whatsapp && (
                  <div className="flex items-center space-x-1">
                    {testResults.whatsapp.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${testResults.whatsapp.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults.whatsapp.message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsapp-enabled"
                  checked={getSetting('whatsapp', 'enabled', false)}
                  onChange={(e) => updateSetting('whatsapp', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="whatsapp-enabled" className="ml-2 block text-sm text-gray-900">
                  Habilitar lembretes via WhatsApp
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enviar lembrete (horas antes do agendamento)
                </label>
                <input
                  type="number"
                  value={getSetting('whatsapp', 'hours_before', 24)}
                  onChange={(e) => updateSetting('whatsapp', 'hours_before', parseInt(e.target.value))}
                  min="1"
                  max="168"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* SMS Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">SMS</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => testConnection('sms')}
                  disabled={testing.sms}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <TestTube className="h-4 w-4" />
                  <span>{testing.sms ? 'Testando...' : 'Testar'}</span>
                </Button>
                {testResults.sms && (
                  <div className="flex items-center space-x-1">
                    {testResults.sms.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm ${testResults.sms.success ? 'text-green-600' : 'text-red-600'}`}>
                      {testResults.sms.message}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sms-enabled"
                  checked={getSetting('sms', 'enabled', false)}
                  onChange={(e) => updateSetting('sms', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="sms-enabled" className="ml-2 block text-sm text-gray-900">
                  Habilitar lembretes via SMS
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enviar lembrete (horas antes do agendamento)
                </label>
                <input
                  type="number"
                  value={getSetting('sms', 'hours_before', 24)}
                  onChange={(e) => updateSetting('sms', 'hours_before', parseInt(e.target.value))}
                  min="1"
                  max="168"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Custom Message */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mensagem Personalizada</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem do lembrete
                </label>
                <textarea
                  value={getSetting('whatsapp', 'custom_message') || getSetting('sms', 'custom_message') || ''}
                  onChange={(e) => {
                    updateSetting('whatsapp', 'custom_message', e.target.value)
                    updateSetting('sms', 'custom_message', e.target.value)
                  }}
                  placeholder={defaultMessage}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Variáveis disponíveis:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div><code>{'{client_name}'}</code> - Nome do cliente</div>
                  <div><code>{'{professional_name}'}</code> - Nome do profissional</div>
                  <div><code>{'{service_name}'}</code> - Nome do serviço</div>
                  <div><code>{'{date}'}</code> - Data do agendamento</div>
                  <div><code>{'{time}'}</code> - Horário do agendamento</div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}