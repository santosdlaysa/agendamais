import { Clock, DollarSign, Check } from 'lucide-react'

export default function ServiceSelector({ services, selectedService, onSelect, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-jet-black-900">Escolha o serviço</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-jet-black-100 rounded-xl h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-jet-black-500">Nenhum serviço disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-jet-black-900">Escolha o serviço</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-jet-black-200 bg-white hover:border-blue-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="pr-8">
                <h3 className="font-semibold text-jet-black-900">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-jet-black-500 mt-1 line-clamp-2">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-sm text-jet-black-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <DollarSign className="w-4 h-4" />
                    <span>R$ {parseFloat(service.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {service.category && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-jet-black-100 text-jet-black-600 rounded-full">
                  {service.category}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
