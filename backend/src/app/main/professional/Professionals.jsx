
import { UserCheck, Plus } from 'lucide-react'
import { Button } from '../ui/button'

export default function Professionals() {
  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Profissionais
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os profissionais da sua equipe
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Profissional
          </Button>
        </div>
      </div>

      <div className="text-center py-12">
        <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Página em desenvolvimento
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Esta funcionalidade será implementada nas próximas fases.
        </p>
      </div>
    </div>
  )
}

