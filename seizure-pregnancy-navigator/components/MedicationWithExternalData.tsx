'use client'

import { useState, useEffect } from 'react'
import ExternalDataIndicator from './ExternalDataIndicator'
import { RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react'

interface MedicationData {
  medication: string
  brand_names: string[]
  pregnancy_category: string
  safety_profile: string
  key_points: string[]
  monitoring: string[]
}

interface ExternalData {
  source: string
  data: any
  timestamp: string
  drug: string
  error?: boolean
  details?: string
}

interface MedicationWithExternalDataProps {
  drugName: string
}

export default function MedicationWithExternalData({ drugName }: MedicationWithExternalDataProps) {
  const [medicationData, setMedicationData] = useState<MedicationData | null>(null)
  const [externalData, setExternalData] = useState<ExternalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedicationData = async (includeExternal = true) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/medications/enhanced?external=${includeExternal}&drug=${encodeURIComponent(drugName)}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setMedicationData(data.local?.medications?.[0] || null)
        setExternalData(data.external)
      } else {
        throw new Error(data.error || 'Failed to fetch medication data')
      }
    } catch (err) {
      console.error('Failed to fetch medication data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicationData()
  }, [drugName])

  const handleRefresh = () => {
    fetchMedicationData(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading medication data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <span className="text-red-800 font-medium">Error loading data</span>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={() => fetchMedicationData(false)}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try loading local data only
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with external data indicator */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {medicationData?.medication || drugName}
        </h2>
        <div className="flex items-center space-x-2">
          <ExternalDataIndicator
            source={externalData?.source || 'Local Data'}
            timestamp={externalData?.timestamp}
            error={externalData?.error}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      {/* Medication Information */}
      {medicationData && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Brand Names</h3>
            <p className="text-gray-700">{medicationData.brand_names.join(', ')}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Pregnancy Category</h3>
            <span className={`px-2 py-1 rounded text-sm font-medium ${
              medicationData.pregnancy_category === 'Category D' 
                ? 'bg-red-100 text-red-800' 
                : medicationData.pregnancy_category === 'Category C'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {medicationData.pregnancy_category}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Safety Profile</h3>
            <p className="text-gray-700">{medicationData.safety_profile}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Key Points</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {medicationData.key_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Monitoring Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {medicationData.monitoring.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* External Data Section */}
      {externalData && !externalData.error && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <ExternalLink className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-gray-900">External Data from {externalData.source}</h3>
          </div>
          
          {externalData.data?.labeling && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Drug Labeling</h4>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  Latest labeling information available from FDA
                </p>
              </div>
            </div>
          )}

          {externalData.data?.adverse && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Adverse Events</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  Recent adverse event reports (for healthcare provider review)
                </p>
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500">
            Last updated: {new Date(externalData.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {/* Error in external data */}
      {externalData?.error && (
        <div className="mt-6 border-t pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-800">
                External data unavailable: {externalData.details || 'Unknown error'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
