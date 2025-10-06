'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

interface EnvStatus {
  success: boolean
  timestamp: string
  environment: string
  vercelRegion?: string
  vercelUrl?: string
  expectedVariables: Array<{
    name: string
    present: boolean
    value: string | null
    length: number
  }>
  missingRequired: number
  missingRequiredVars: string[]
  status: 'HEALTHY' | 'WARNING' | 'ERROR'
}

export default function EnvironmentStatus() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvironment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/env-check')
      const data = await response.json()
      
      if (data.success) {
        setEnvStatus(data)
      } else {
        setError(data.error || 'Failed to check environment')
      }
    } catch (err) {
      setError('Failed to fetch environment status')
      console.error('Environment check error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-green-100 text-green-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Checking environment variables...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span>Error: {error}</span>
        </div>
        <button
          onClick={checkEnvironment}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!envStatus) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Environment Status</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(envStatus.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(envStatus.status)}`}>
            {envStatus.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm font-medium text-gray-600">Environment:</span>
          <span className="ml-2 text-sm text-gray-900">{envStatus.environment}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Region:</span>
          <span className="ml-2 text-sm text-gray-900">{envStatus.vercelRegion || 'Unknown'}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Missing Required:</span>
          <span className="ml-2 text-sm text-gray-900">{envStatus.missingRequired}</span>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Total Variables:</span>
          <span className="ml-2 text-sm text-gray-900">{envStatus.expectedVariables.length}</span>
        </div>
      </div>

      {envStatus.missingRequiredVars.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Missing Required Variables:</h4>
          <ul className="text-sm text-yellow-700">
            {envStatus.missingRequiredVars.map((varName) => (
              <li key={varName} className="flex items-center space-x-2">
                <XCircle className="w-4 h-4" />
                <span>{varName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Environment Variables:</h4>
        <div className="max-h-60 overflow-y-auto">
          {envStatus.expectedVariables.map((envVar) => (
            <div key={envVar.name} className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                {envVar.present ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm font-medium text-gray-900">{envVar.name}</span>
              </div>
              <div className="text-sm text-gray-600">
                {envVar.present ? (
                  <span className="text-green-600">
                    {envVar.value} ({envVar.length} chars)
                  </span>
                ) : (
                  <span className="text-red-600">Not set</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Last checked: {new Date(envStatus.timestamp).toLocaleString()}
        </span>
        <button
          onClick={checkEnvironment}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
