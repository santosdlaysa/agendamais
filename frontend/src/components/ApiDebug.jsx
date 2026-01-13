import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import api from '../utils/api'

export default function ApiDebug() {
  const [results, setResults] = useState({})
  const [testing, setTesting] = useState(false)

  const endpoints = [
    { name: 'Clientes', path: '/clients?per_page=1' },
    { name: 'Profissionais', path: '/professionals?per_page=1' },
    { name: 'Serviços', path: '/services?per_page=1' },
    { name: 'Agendamentos', path: '/appointments?per_page=1' },
    { name: 'Agendamentos Concluídos', path: '/appointments?status=completed&per_page=5' }
  ]

  const testEndpoints = async () => {
    setTesting(true)
    const newResults = {}

    console.log('🔍 Iniciando testes da API...')
    console.log('📍 Base URL:', api.defaults.baseURL)

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Testando ${endpoint.name}: ${endpoint.path}`)
        const startTime = Date.now()

        const response = await api.get(endpoint.path)
        const endTime = Date.now()
        const responseTime = endTime - startTime

        newResults[endpoint.name] = {
          status: 'success',
          statusCode: response.status,
          responseTime,
          data: response.data,
          totalItems: response.data.pagination?.total || response.data?.length || 'N/A'
        }

        console.log(`✅ ${endpoint.name} OK: ${response.status} (${responseTime}ms)`)
        if (response.data.pagination) {
          console.log(`📊 Total: ${response.data.pagination.total}`)
        }
      } catch (error) {
        console.error(`❌ ${endpoint.name} ERRO:`, error)

        newResults[endpoint.name] = {
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          error: error.message,
          details: error.response?.data || 'Sem detalhes'
        }
      }
    }

    setResults(newResults)
    setTesting(false)
    console.log('🏁 Testes da API concluídos')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      default: return 'bg-yellow-50 border-yellow-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-jet-black-900">Diagnóstico da API</h1>
          <p className="text-jet-black-600">Teste a conectividade com o backend</p>
          <p className="text-sm text-jet-black-500 mt-1">URL: {api.defaults.baseURL}</p>
        </div>
        <button
          onClick={testEndpoints}
          disabled={testing}
          className="flex items-center px-4 py-2 bg-periwinkle-600 text-white rounded-lg hover:bg-periwinkle-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
          {testing ? 'Testando...' : 'Testar Endpoints'}
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="grid gap-4">
          {endpoints.map(endpoint => {
            const result = results[endpoint.name]
            if (!result) return null

            return (
              <div key={endpoint.name} className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <h3 className="font-medium text-jet-black-900">{endpoint.name}</h3>
                  </div>
                  <div className="text-sm text-jet-black-600">
                    Status: {result.statusCode}
                    {result.responseTime && ` (${result.responseTime}ms)`}
                  </div>
                </div>

                <p className="text-sm text-jet-black-600 mb-2">
                  <code className="bg-white px-2 py-1 rounded text-xs">{endpoint.path}</code>
                </p>

                {result.status === 'success' ? (
                  <div className="space-y-1">
                    <p className="text-sm text-green-700">
                      ✅ Conectado com sucesso
                    </p>
                    <p className="text-sm text-jet-black-600">
                      Total de itens: <strong>{result.totalItems}</strong>
                    </p>
                    {result.data && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-jet-black-500">Ver resposta completa</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-red-700">
                      ❌ Erro: {result.error}
                    </p>
                    {result.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-jet-black-500">Ver detalhes do erro</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                          {typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {Object.keys(results).length === 0 && (
        <div className="text-center py-12 text-jet-black-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>Clique em "Testar Endpoints" para verificar a conectividade com a API</p>
        </div>
      )}
    </div>
  )
}