import { MapPin, Phone, Clock } from 'lucide-react'

export default function BusinessHeader({ business }) {
  if (!business) return null

  // Mapear campos do backend para o componente
  const name = business.business_name || business.name
  const logo = business.business_logo || business.logo_url
  const address = business.business_address || business.address
  const phone = business.business_phone || business.phone

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div className="flex items-start gap-4">
        {logo ? (
          <img
            src={logo}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {name?.charAt(0) || 'E'}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-xl font-bold text-jet-black-900">{name}</h1>
          {business.description && (
            <p className="text-jet-black-600 text-sm mt-1">{business.description}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-3 text-sm text-jet-black-500">
            {address && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
