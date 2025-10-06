'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Trash2, 
  Edit,
  ChevronDown,
  ChevronUp,
  Pill
} from 'lucide-react'

interface Seizure {
  id: string
  date: string
  time: string
  type: string
  duration: number
  durationMinutes?: number
  durationSeconds?: number
  severity: number
  triggers: string[]
  notes: string
  medicationTaken: boolean
}

interface SeizureListProps {
  seizures: Seizure[]
  onDelete: (id: string) => void
}

// Helper function to format duration display
const formatDuration = (seizure: Seizure): string => {
  if (seizure.durationMinutes !== undefined && seizure.durationSeconds !== undefined) {
    const minutes = seizure.durationMinutes
    const seconds = seizure.durationSeconds
    
    if (minutes > 0 && seconds > 0) {
      return `${minutes}m ${seconds}s`
    } else if (minutes > 0) {
      return `${minutes}m`
    } else if (seconds > 0) {
      return `${seconds}s`
    }
  }
  
  // Fallback to total duration in minutes
  if (seizure.duration < 1) {
    return `${Math.round(seizure.duration * 60)}s`
  } else {
    return `${seizure.duration.toFixed(1)}m`
  }
}

export default function SeizureList({ seizures, onDelete }: SeizureListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'text-green-600 bg-green-100'
    if (severity <= 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getSeverityText = (severity: number) => {
    const levels = ['', 'Very Mild', 'Mild', 'Moderate', 'Severe', 'Very Severe']
    return levels[severity] || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  if (seizures.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Seizures Logged</h3>
        <p className="text-gray-600">
          Start tracking your seizures to help your healthcare team provide better care.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Seizures ({seizures.length})</h3>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triggers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seizures.map((seizure, index) => (
                <tr key={seizure.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{formatDate(seizure.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatTime(seizure.time)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>{seizure.type}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{formatDuration(seizure)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(seizure.severity)}`}>
                      {getSeverityText(seizure.severity)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[240px]">
                    <div className="flex flex-wrap gap-1">
                      {seizure.triggers && seizure.triggers.length > 0 ? (
                        seizure.triggers.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{t}</span>
                        ))
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {seizure.medicationTaken ? (
                      <span className="inline-flex items-center text-green-600"><Pill className="w-4 h-4 mr-1"/>Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => setExpandedId(expandedId === seizure.id ? null : seizure.id)}
                      className="text-gray-400 hover:text-gray-600 mr-3"
                    >
                      {expandedId === seizure.id ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                    </button>
                    <button
                      onClick={() => onDelete(seizure.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Expanded row content */}
        {seizures.map((seizure) => (
          expandedId === seizure.id ? (
            <div key={seizure.id} className="px-4 py-4 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {seizure.triggers.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Possible Triggers</h5>
                    <div className="flex flex-wrap gap-2">
                      {seizure.triggers.map((trigger, index) => (
                        <span key={index} className="px-2 py-1 bg-white border text-gray-700 text-xs rounded-full">{trigger}</span>
                      ))}
                    </div>
                  </div>
                )}
                {seizure.notes && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                    <p className="text-sm text-gray-700">{seizure.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  )
}
