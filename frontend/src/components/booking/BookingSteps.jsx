import { Check } from 'lucide-react'

const allSteps = [
  { number: 1, title: 'Serviço' },
  { number: 2, title: 'Profissional' },
  { number: 3, title: 'Data e Hora' },
  { number: 4, title: 'Confirmação' },
]

export default function BookingSteps({ currentStep, totalSteps = 4 }) {
  const steps = allSteps.slice(0, totalSteps)
  return (
    <div className="w-full py-4">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            {/* Step circle and title */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-periwinkle-600 text-white ring-4 ring-periwinkle-100'
                    : 'bg-jet-black-200 text-jet-black-500'
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center hidden sm:block ${
                  currentStep >= step.number ? 'text-periwinkle-600' : 'text-jet-black-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-3 rounded transition-all duration-300 ${
                  currentStep > step.number ? 'bg-green-500' : 'bg-jet-black-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
