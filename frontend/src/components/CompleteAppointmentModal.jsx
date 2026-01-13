import React, { useState } from 'react'
import { X, DollarSign, FileText, CheckCircle, AlertCircle, CreditCard, Banknote } from 'lucide-react'
import { appointmentService } from '../utils/api'
import toast from 'react-hot-toast'

const CompleteAppointmentModal = ({ appointment, onComplete, onClose }) => {
  const [notes, setNotes] = useState('')
  const [customPrice, setCustomPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('dinheiro')

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'dinheiro': 'Dinheiro',
      'cartao_credito': 'Cartão de Crédito',
      'cartao_debito': 'Cartão de Débito',
      'pix': 'PIX'
    }
    return labels[method] || method
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const result = await appointmentService.completeAppointment(
        appointment.id,
        notes,
        customPrice ? parseFloat(customPrice) : null,
        paymentMethod
      )
      
      toast.success(`Agendamento concluído! Valor: R$ ${result.calculation.price_calculated}`)
      onComplete(result)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao concluir agendamento')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteWithDefaultPrice = async () => {
    setLoading(true)
    try {
      const result = await appointmentService.completeAppointment(
        appointment.id,
        'Serviço realizado com sucesso',
        null,
        paymentMethod
      )
      
      toast.success(`Agendamento concluído! Valor: R$ ${result.calculation.price_calculated}`)
      onComplete(result)
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao concluir agendamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-jet-black-900">Concluir Agendamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-jet-black-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Appointment Info */}
          <div className="bg-jet-black-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-jet-black-600">Cliente:</span>
                <span className="font-medium">{appointment.client.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jet-black-600">Serviço:</span>
                <span className="font-medium">{appointment.service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jet-black-600">Profissional:</span>
                <span className="font-medium">{appointment.professional.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jet-black-600">Preço Original:</span>
                <span className="font-medium text-green-600">R$ {parseFloat(appointment.service.price).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-jet-black-700 mb-3">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'dinheiro'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-jet-black-300 bg-white text-jet-black-700 hover:border-jet-black-400'
                }`}
              >
                <Banknote className="w-5 h-5 mr-2" />
                Dinheiro
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_credito')}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'cartao_credito'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-jet-black-300 bg-white text-jet-black-700 hover:border-jet-black-400'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_debito')}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'cartao_debito'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-jet-black-300 bg-white text-jet-black-700 hover:border-jet-black-400'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Cartão de Débito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${
                  paymentMethod === 'pix'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-jet-black-300 bg-white text-jet-black-700 hover:border-jet-black-400'
                }`}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                PIX
              </button>
            </div>
          </div>

          {/* Quick Complete Button */}
          <div className="mb-4">
            <button
              onClick={handleCompleteWithDefaultPrice}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {loading ? 'Processando...' : `Concluir com Preço Padrão (R$ ${parseFloat(appointment.service.price).toFixed(2)}) - ${getPaymentMethodLabel(paymentMethod)}`}
            </button>
          </div>

          {/* Or separator */}
          <div className="flex items-center mb-4">
            <hr className="flex-1 border-jet-black-300" />
            <span className="px-3 text-sm text-jet-black-500">ou</span>
            <hr className="flex-1 border-jet-black-300" />
          </div>

          {/* Custom completion form */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-jet-black-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Observações
              </label>
              <textarea
                placeholder="Descreva como foi o atendimento, alguma observação especial..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="customPrice"
                  checked={showCustomPrice}
                  onChange={(e) => setShowCustomPrice(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="customPrice" className="text-sm font-medium text-jet-black-700">
                  Usar preço personalizado
                </label>
              </div>
              
              {showCustomPrice && (
                <div>
                  <label className="flex items-center text-sm font-medium text-jet-black-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Preço Personalizado
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={`Padrão: R$ ${parseFloat(appointment.service.price).toFixed(2)}`}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-jet-black-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-jet-black-500 mt-1">
                    Deixe em branco para usar o preço padrão do serviço
                  </p>
                </div>
              )}
            </div>

            {/* Alert for custom price */}
            {showCustomPrice && customPrice && (
              <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-medium">Preço personalizado será aplicado</p>
                  <p className="text-yellow-700">
                    Valor final: R$ {parseFloat(customPrice || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t bg-jet-black-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-jet-black-300 text-jet-black-700 rounded-lg hover:bg-jet-black-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleComplete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Concluir e Calcular'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompleteAppointmentModal