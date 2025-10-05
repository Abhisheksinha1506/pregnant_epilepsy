'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, Heart, Stethoscope } from 'lucide-react'

interface TrimesterInfo {
  title: string
  weeks: string
  color: string
  description: string
  keyPoints: string[]
}

interface TrimesterCardProps {
  trimester: number
  info: TrimesterInfo
  currentWeek: number
}

export default function TrimesterCard({ trimester, info, currentWeek }: TrimesterCardProps) {
  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1: return 'bg-pink-500'
      case 2: return 'bg-blue-500'
      case 3: return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrimesterIcon = (trimester: number) => {
    switch (trimester) {
      case 1: return <Heart className="w-6 h-6" />
      case 2: return <Stethoscope className="w-6 h-6" />
      case 3: return <AlertTriangle className="w-6 h-6" />
      default: return <Info className="w-6 h-6" />
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-12 h-12 ${getTrimesterColor(trimester)} rounded-lg flex items-center justify-center text-white`}>
          {getTrimesterIcon(trimester)}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{info.title}</h3>
          <p className="text-sm text-gray-600">{info.weeks}</p>
          <p className="text-sm text-gray-700">{info.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Points */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Focus Areas</h4>
          <ul className="space-y-3">
            {info.keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Trimester-Specific Guidance */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Epilepsy Considerations</h4>
          {trimester === 1 && (
            <div className="space-y-3">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h5 className="font-semibold text-pink-900 mb-2">Early Pregnancy</h5>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Continue prescribed medications</li>
                  <li>• Start folic acid supplementation</li>
                  <li>• Schedule pre-pregnancy counseling</li>
                  <li>• Monitor medication levels</li>
                </ul>
              </div>
            </div>
          )}

          {trimester === 2 && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2">Mid-Pregnancy</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Detailed anomaly scan at 18-20 weeks</li>
                  <li>• Continue medication monitoring</li>
                  <li>• Monitor for seizure changes</li>
                  <li>• Regular OB-GYN and neurologist visits</li>
                </ul>
              </div>
            </div>
          )}

          {trimester === 3 && (
            <div className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-2">Late Pregnancy</h5>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Final preparations for delivery</li>
                  <li>• Discuss birth plan with healthcare team</li>
                  <li>• Prepare for postpartum adjustments</li>
                  <li>• Emergency contact information ready</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-yellow-900 mb-1">Important Reminder</h5>
            <p className="text-sm text-yellow-800">
              Always consult your healthcare provider before making any changes to your medications. 
              This information is for educational purposes only and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
