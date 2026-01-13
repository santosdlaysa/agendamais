import { Check, Star, User } from 'lucide-react'

export default function ProfessionalSelector({
  professionals,
  selectedProfessional,
  onSelect,
  loading,
  allowAny = true
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-jet-black-900">Escolha o profissional</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-jet-black-100 rounded-xl h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-jet-black-900">Escolha o profissional</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* Opção "Sem preferência" */}
        {allowAny && (
          <button
            onClick={() => onSelect(null)}
            className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 hover:shadow-md ${
              selectedProfessional === null
                ? 'border-periwinkle-500 bg-periwinkle-50 ring-2 ring-periwinkle-200'
                : 'border-jet-black-200 bg-white hover:border-periwinkle-300'
            }`}
          >
            {selectedProfessional === null && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-periwinkle-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="w-16 h-16 mx-auto rounded-full bg-jet-black-100 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-jet-black-400" />
            </div>

            <h3 className="font-semibold text-jet-black-900">Sem preferência</h3>
            <p className="text-sm text-jet-black-500 mt-1">Qualquer profissional disponível</p>
          </button>
        )}

        {/* Lista de profissionais */}
        {professionals.map((professional) => {
          const isSelected = selectedProfessional?.id === professional.id
          return (
            <button
              key={professional.id}
              onClick={() => onSelect(professional)}
              className={`relative p-4 rounded-xl border-2 text-center transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-periwinkle-500 bg-periwinkle-50 ring-2 ring-periwinkle-200'
                  : 'border-jet-black-200 bg-white hover:border-periwinkle-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-periwinkle-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {professional.photo_url ? (
                <img
                  src={professional.photo_url}
                  alt={professional.name}
                  className="w-16 h-16 mx-auto rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-periwinkle-400 to-periwinkle-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                  {professional.name?.charAt(0) || 'P'}
                </div>
              )}

              <h3 className="font-semibold text-jet-black-900">{professional.name}</h3>

              {professional.role && (
                <p className="text-sm text-jet-black-500">{professional.role}</p>
              )}

              {professional.rating && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-jet-black-700">
                    {professional.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {professionals.length === 0 && (
        <p className="text-center text-jet-black-500 py-4">
          Nenhum profissional disponível para este serviço.
        </p>
      )}
    </div>
  )
}
