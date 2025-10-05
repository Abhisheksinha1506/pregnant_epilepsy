'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

interface ExternalDataIndicatorProps {
  source: string
  timestamp?: string
  error?: boolean
  loading?: boolean
  onRefresh?: () => void
}

export default function ExternalDataIndicator({ 
  source, 
  timestamp, 
  error, 
  loading = false,
  onRefresh 
}: ExternalDataIndicatorProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (error) {
      setStatus('error')
    } else if (timestamp && !loading) {
      setStatus('success')
    } else if (loading) {
      setStatus('loading')
    }
  }, [error, timestamp, loading])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Loading external data...'
      case 'success':
        return `Live data from ${source}`
      case 'error':
        return `Using cached data (${source} unavailable)`
      default:
        return 'Unknown status'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'loading':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {getStatusIcon()}
      
      <span className={`text-xs ${getStatusColor()}`}>
        {getStatusText()}
      </span>

      {timestamp && status === 'success' && (
        <span className="text-xs text-gray-500">
          ({new Date(timestamp).toLocaleTimeString()})
        </span>
      )}

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-3 h-3 text-gray-500" />
        </button>
      )}
    </div>
  )
}
