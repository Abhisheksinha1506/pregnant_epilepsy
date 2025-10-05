'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Pill, 
  AlertTriangle, 
  Shield, 
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Heart,
  Stethoscope
} from 'lucide-react'

interface Medication {
  medication: string
  brand_names: string[]
  pregnancy_category: string
  safety_profile: string
  key_points: string[]
  monitoring: string[]
}

interface MedicationCardProps {
  medication: Medication
}

export default function MedicationCard({ medication }: MedicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Category A':
        return 'text-green-600 bg-green-100'
      case 'Category B':
        return 'text-blue-600 bg-blue-100'
      case 'Category C':
        return 'text-yellow-600 bg-yellow-100'
      case 'Category D':
        return 'text-orange-600 bg-orange-100'
      case 'Category X':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSafetyIcon = (safety: string) => {
    if (safety.includes('safer')) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (safety.includes('risk')) return <AlertTriangle className="w-5 h-5 text-red-600" />
    return <Info className="w-5 h-5 text-blue-600" />
  }

  const getSafetyColor = (safety: string) => {
    if (safety.includes('safer')) return 'text-green-600'
    if (safety.includes('risk')) return 'text-red-600'
    return 'text-blue-600'
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  {medication.medication}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medication.pregnancy_category)}`}>
                  {medication.pregnancy_category}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  {getSafetyIcon(medication.safety_profile)}
                  <span className={`text-sm font-medium ${getSafetyColor(medication.safety_profile)}`}>
                    {medication.safety_profile}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Brand names:</span>
                  <span>{medication.brand_names.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Points */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>Key Information</span>
                </h4>
                <ul className="space-y-2">
                  {medication.key_points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Monitoring Requirements */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                  <span>Monitoring Requirements</span>
                </h4>
                <ul className="space-y-2">
                  {medication.monitoring.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Safety Notice */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1">Important Safety Notice</h5>
                  <p className="text-sm text-blue-800">
                    Always consult your healthcare provider before making any changes to your medications. 
                    This information is for educational purposes only and does not replace professional medical advice.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
