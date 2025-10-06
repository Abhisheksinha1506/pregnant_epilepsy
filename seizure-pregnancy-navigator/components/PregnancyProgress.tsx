'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Baby, Target, AlertTriangle, CheckCircle } from 'lucide-react'

interface PregnancyProgressProps {
  currentWeek: number
  dueDate: string
  trimester: number
  pregnancyStatus?: 'planning' | 'pregnant' | 'postpartum' | 'miscarriage'
  pregnancyStartDate?: string
  onStatusChange?: (status: string) => void
}

export default function PregnancyProgress({ 
  currentWeek, 
  dueDate, 
  trimester, 
  pregnancyStatus = 'pregnant',
  pregnancyStartDate,
  onStatusChange 
}: PregnancyProgressProps) {
  const progressPercentage = Math.min((currentWeek / 40) * 100, 100)
  
  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 0: return 'bg-gray-500'
      case 1: return 'bg-pink-500'
      case 2: return 'bg-blue-500'
      case 3: return 'bg-purple-500'
      case 4: return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrimesterText = (trimester: number) => {
    switch (trimester) {
      case 0: return 'Pre-Pregnancy'
      case 1: return 'First Trimester'
      case 2: return 'Second Trimester'
      case 3: return 'Third Trimester'
      case 4: return 'Post-Term'
      default: return 'Pre-Pregnancy'
    }
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'planning':
        return {
          title: 'Pre-Pregnancy Planning',
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
      case 'pregnant':
        return {
          title: 'Currently Pregnant',
          color: 'bg-pink-500',
          textColor: 'text-pink-700',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-200'
        }
      case 'postpartum':
        return {
          title: 'Postpartum',
          color: 'bg-green-500',
          textColor: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'miscarriage':
        return {
          title: 'Miscarriage',
          color: 'bg-red-500',
          textColor: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        }
      default:
        return {
          title: 'Unknown Status',
          color: 'bg-gray-500',
          textColor: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        }
    }
  }

  const statusInfo = getStatusInfo(pregnancyStatus)

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pregnancy Progress</h2>
            <p className="text-sm text-gray-600">
              {pregnancyStatus === 'planning' ? 'Pre-Pregnancy Planning' : 
               pregnancyStatus === 'postpartum' ? 'Postpartum Period' :
               pregnancyStatus === 'miscarriage' ? 'Miscarriage' :
               `Week ${currentWeek} of 40`}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {dueDate && (
            <>
              <p className="text-sm text-gray-600">Due Date</p>
              <p className="font-semibold text-gray-900">{formatDueDate(dueDate)}</p>
            </>
          )}
          {pregnancyStartDate && (
            <>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(pregnancyStartDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Status Display and Change */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${statusInfo.color}`} />
            <span className={`font-semibold ${statusInfo.textColor}`}>
              {statusInfo.title}
            </span>
          </div>
          
          {onStatusChange && (
            <div className="flex space-x-2">
              <button
                onClick={() => onStatusChange('pregnant')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  pregnancyStatus === 'pregnant' 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-pink-50'
                }`}
              >
                Pregnant
              </button>
              <button
                onClick={() => onStatusChange('postpartum')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  pregnancyStatus === 'postpartum' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                }`}
              >
                Postpartum
              </button>
              <button
                onClick={() => onStatusChange('miscarriage')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  pregnancyStatus === 'miscarriage' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                }`}
              >
                Miscarriage
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Only show for pregnant status */}
      {pregnancyStatus === 'pregnant' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full ${getTrimesterColor(trimester)}`}
            />
          </div>
        </div>
      )}

      {/* Trimester Indicator - Only show for pregnant status */}
      {pregnancyStatus === 'pregnant' && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${getTrimesterColor(trimester)}`} />
            <span className="text-sm font-medium text-gray-700">
              {getTrimesterText(trimester)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{40 - currentWeek} weeks to go</span>
            </div>
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pregnancyStatus === 'pregnant' ? (
          <>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Baby className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Current Week</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{currentWeek}</p>
              <p className="text-sm text-blue-700">weeks pregnant</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Trimester</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{trimester}</p>
              <p className="text-sm text-green-700">{getTrimesterText(trimester)}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Progress</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</p>
              <p className="text-sm text-purple-700">complete</p>
            </div>
          </>
        ) : pregnancyStatus === 'postpartum' ? (
          <>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Status</span>
              </div>
              <p className="text-2xl font-bold text-green-600">✓</p>
              <p className="text-sm text-green-700">Postpartum</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Duration</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{currentWeek}</p>
              <p className="text-sm text-blue-700">weeks since start</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Recovery</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">100%</p>
              <p className="text-sm text-purple-700">pregnancy complete</p>
            </div>
          </>
        ) : pregnancyStatus === 'miscarriage' ? (
          <>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-900">Status</span>
              </div>
              <p className="text-2xl font-bold text-red-600">⚠</p>
              <p className="text-sm text-red-700">Miscarriage</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Duration</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{currentWeek}</p>
              <p className="text-sm text-blue-700">weeks before loss</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Support</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">💙</p>
              <p className="text-sm text-gray-700">available</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-900">Status</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">📋</p>
              <p className="text-sm text-gray-700">Planning</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Preparation</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">✓</p>
              <p className="text-sm text-blue-700">Ready to start</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Next Step</span>
              </div>
              <p className="text-2xl font-bold text-green-600">→</p>
              <p className="text-sm text-green-700">Begin tracking</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
