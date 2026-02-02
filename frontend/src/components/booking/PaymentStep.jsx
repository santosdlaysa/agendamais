import { CreditCard, Shield, Lock, Loader2 } from 'lucide-react'

export default function PaymentStep({
  service,
  business,
  loading,
  onPay
}) {
  const price = parseFloat(service?.price || 0)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-jet-black-900">Pagamento</h2>
        <p className="text-jet-black-600 mt-1">
          Finalize seu agendamento realizando o pagamento
        </p>
      </div>

      {/* Resumo do valor */}
      <div className="bg-gradient-to-r from-periwinkle-50 to-periwinkle-100 rounded-xl p-6 border border-periwinkle-200">
        <div className="text-center">
          <p className="text-sm text-jet-black-600 mb-1">Valor do serviço</p>
          <p className="text-4xl font-bold text-jet-black-900">
            R$ {price.toFixed(2)}
          </p>
          <p className="text-sm text-jet-black-500 mt-2">
            {service?.name} - {service?.duration} min
          </p>
        </div>
      </div>

      {/* Informações de segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-900">Pagamento seguro</p>
            <p className="text-sm text-green-700 mt-1">
              Seus dados de pagamento são processados de forma segura pelo Stripe,
              a mesma plataforma usada por milhões de empresas no mundo.
            </p>
          </div>
        </div>
      </div>

      {/* Métodos aceitos */}
      <div className="flex items-center justify-center gap-4 text-jet-black-400">
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4" />
          <span>Cartão de Crédito</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2 text-sm">
          <span>PIX</span>
        </div>
      </div>

      {/* Botão de pagamento */}
      <button
        onClick={onPay}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
          loading
            ? 'bg-jet-black-200 text-jet-black-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pagar R$ {price.toFixed(2)}
          </>
        )}
      </button>

      {/* Nota sobre redirecionamento */}
      <p className="text-xs text-center text-jet-black-500">
        Ao clicar em "Pagar", você será redirecionado para a página segura de pagamento do Stripe.
        Após a confirmação, seu agendamento será finalizado.
      </p>
    </div>
  )
}
