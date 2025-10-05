'use client'

import { motion } from 'framer-motion'
import { Calendar, Heart, Baby, Target } from 'lucide-react'

interface PregnancyProgressProps {
  currentWeek: number
  dueDate: string
  trimester: number
}

export default function PregnancyProgress({ currentWeek, dueDate, trimester }: PregnancyProgressProps) {
  const progressPercentage = Math.min((currentWeek / 40) * 100, 100)
  
  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1: return 'bg-pink-500'
      case 2: return 'bg-blue-500'
      case 3: return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTrimesterText = (trimester: number) => {
    switch (trimester) {
      case 1: return 'First Trimester'
      case 2: return 'Second Trimester'
      case 3: return 'Third Trimester'
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pregnancy Progress</h2>
            <p className="text-sm text-gray-600">Week {currentWeek} of 40</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Due Date</p>
          <p className="font-semibold text-gray-900">{formatDueDate(dueDate)}</p>
        </div>
      </div>

      {/* Progress Bar */}
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

      {/* Trimester Indicator */}
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

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}
