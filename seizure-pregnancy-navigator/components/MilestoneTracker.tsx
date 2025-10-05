'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, Target, Calendar } from 'lucide-react'

interface Milestone {
  week: number
  title: string
  completed: boolean
}

interface MilestoneTrackerProps {
  milestones: Milestone[]
  currentWeek: number
}

export default function MilestoneTracker({ milestones, currentWeek }: MilestoneTrackerProps) {
  const upcomingMilestones = milestones.filter(m => !m.completed && m.week > currentWeek)
  const completedMilestones = milestones.filter(m => m.completed)
  const nextMilestone = upcomingMilestones[0]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <Target className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Pregnancy Milestones</h3>
          <p className="text-sm text-gray-600">Track your pregnancy journey</p>
        </div>
      </div>

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Next Milestone</h4>
              <p className="text-sm text-blue-800">
                {nextMilestone.title} - Week {nextMilestone.week}
                {nextMilestone.week > currentWeek && (
                  <span className="ml-2">
                    ({nextMilestone.week - currentWeek} weeks away)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              milestone.completed
                ? 'bg-green-50 border-green-200'
                : milestone.week === currentWeek
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                milestone.completed
                  ? 'bg-green-500'
                  : milestone.week === currentWeek
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}>
                {milestone.completed ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Calendar className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold ${
                  milestone.completed
                    ? 'text-green-900'
                    : milestone.week === currentWeek
                    ? 'text-blue-900'
                    : 'text-gray-700'
                }`}>
                  {milestone.title}
                </h4>
                <p className={`text-sm ${
                  milestone.completed
                    ? 'text-green-700'
                    : milestone.week === currentWeek
                    ? 'text-blue-700'
                    : 'text-gray-600'
                }`}>
                  Week {milestone.week}
                  {milestone.week === currentWeek && ' (Current)'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{completedMilestones.length}</p>
          <p className="text-sm text-green-700">milestones reached</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Remaining</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{upcomingMilestones.length}</p>
          <p className="text-sm text-blue-700">milestones to go</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-900">Progress</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round((completedMilestones.length / milestones.length) * 100)}%
          </p>
          <p className="text-sm text-purple-700">complete</p>
        </div>
      </div>
    </div>
  )
}
