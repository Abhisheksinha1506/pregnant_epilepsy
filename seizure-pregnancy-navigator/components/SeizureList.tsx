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
  severity: number
  triggers: string[]
  notes: string
  medicationTaken: boolean
}

interface SeizureListProps {
  seizures: Seizure[]
  onDelete: (id: string) => void
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Seizures ({seizures.length})
      </h3>
      
      {seizures.map((seizure, index) => (
        <motion.div
          key={seizure.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {seizure.type}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(seizure.severity)}`}>
                      {getSeverityText(seizure.severity)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(seizure.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(seizure.time)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{seizure.duration} min</span>
                    </div>
                    {seizure.medicationTaken && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Pill className="w-4 h-4" />
                        <span>Medication taken</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setExpandedId(expandedId === seizure.id ? null : seizure.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {expandedId === seizure.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
                
                <button
                  onClick={() => onDelete(seizure.id)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Expanded Details */}
            {expandedId === seizure.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Triggers */}
                  {seizure.triggers.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Possible Triggers</h5>
                      <div className="flex flex-wrap gap-2">
                        {seizure.triggers.map((trigger, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Notes */}
                  {seizure.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Notes</h5>
                      <p className="text-sm text-gray-600">{seizure.notes}</p>
                    </div>
                  )}
                </div>
                
                {/* Severity Indicator */}
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Severity Level</h5>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-3 rounded-full ${
                            level <= seizure.severity
                              ? level <= 2
                                ? 'bg-green-500'
                                : level <= 3
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {seizure.severity}/5 - {getSeverityText(seizure.severity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
