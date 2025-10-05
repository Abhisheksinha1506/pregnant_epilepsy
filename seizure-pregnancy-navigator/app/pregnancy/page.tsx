'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Heart, 
  Baby, 
  Stethoscope, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import PregnancyProgress from '@/components/PregnancyProgress'
import TrimesterCard from '@/components/TrimesterCard'
import MilestoneTracker from '@/components/MilestoneTracker'

export default function PregnancyPage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load pregnancy data from localStorage
    const savedDueDate = localStorage.getItem('dueDate')
    if (savedDueDate) {
      setDueDate(savedDueDate)
      calculateCurrentWeek(savedDueDate)
    }
    setIsLoaded(true)
  }, [])

  const calculateCurrentWeek = (dueDateStr: string) => {
    const due = new Date(dueDateStr)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    const currentWeek = Math.max(0, 40 - diffWeeks)
    setCurrentWeek(currentWeek)
  }

  const handleDueDateChange = (newDueDate: string) => {
    setDueDate(newDueDate)
    localStorage.setItem('dueDate', newDueDate)
    calculateCurrentWeek(newDueDate)
  }

  const getTrimester = (week: number) => {
    if (week <= 12) return 1
    if (week <= 26) return 2
    return 3
  }

  const getTrimesterInfo = (trimester: number) => {
    switch (trimester) {
      case 1:
        return {
          title: "First Trimester",
          weeks: "Weeks 1-12",
          color: "bg-pink-500",
          description: "Early pregnancy development and medication monitoring",
          keyPoints: [
            "Continue prescribed epilepsy medications",
            "Start folic acid supplementation (5mg daily)",
            "Schedule pre-pregnancy counseling",
            "Regular medication level monitoring"
          ]
        }
      case 2:
        return {
          title: "Second Trimester",
          weeks: "Weeks 13-26",
          color: "bg-blue-500",
          description: "Detailed monitoring and anomaly scans",
          keyPoints: [
            "Detailed anomaly scan at 18-20 weeks",
            "Continue medication monitoring",
            "Monitor for seizure changes",
            "Regular OB-GYN and neurologist appointments"
          ]
        }
      case 3:
        return {
          title: "Third Trimester",
          weeks: "Weeks 27-40",
          color: "bg-purple-500",
          description: "Final preparations and delivery planning",
          keyPoints: [
            "Final preparations for delivery",
            "Discuss birth plan with healthcare team",
            "Prepare for postpartum medication adjustments",
            "Emergency contact information ready"
          ]
        }
      default:
        return {
          title: "Pre-Pregnancy",
          weeks: "Planning Phase",
          color: "bg-gray-500",
          description: "Pre-pregnancy planning and optimization",
          keyPoints: [
            "Pre-pregnancy counseling",
            "Medication optimization",
            "Folic acid supplementation",
            "Risk assessment and planning"
          ]
        }
    }
  }

  const milestones = [
    { week: 0, title: "Pre-Pregnancy Planning", completed: currentWeek >= 0 },
    { week: 4, title: "Positive Pregnancy Test", completed: currentWeek >= 4 },
    { week: 8, title: "First Ultrasound", completed: currentWeek >= 8 },
    { week: 12, title: "End of First Trimester", completed: currentWeek >= 12 },
    { week: 18, title: "Anatomy Scan", completed: currentWeek >= 18 },
    { week: 24, title: "Viability Milestone", completed: currentWeek >= 24 },
    { week: 28, title: "Third Trimester Begins", completed: currentWeek >= 28 },
    { week: 32, title: "Growth Scan", completed: currentWeek >= 32 },
    { week: 36, title: "Full Term", completed: currentWeek >= 36 },
    { week: 40, title: "Due Date", completed: currentWeek >= 40 }
  ]

  const currentTrimester = getTrimester(currentWeek)
  const trimesterInfo = getTrimesterInfo(currentTrimester)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pregnancy Tracker</h1>
            <p className="text-gray-600">
              Track your pregnancy journey with epilepsy-specific guidance and milestones.
            </p>
          </div>

          {/* Due Date Input */}
          {!dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Your Due Date</h3>
              <div className="flex items-center space-x-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600">
                  Enter your estimated due date to start tracking
                </span>
              </div>
            </motion.div>
          )}

          {/* Current Progress */}
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <PregnancyProgress 
                currentWeek={currentWeek}
                dueDate={dueDate}
                trimester={currentTrimester}
              />
            </motion.div>
          )}

          {/* Current Trimester Info */}
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <TrimesterCard 
                trimester={currentTrimester}
                info={trimesterInfo}
                currentWeek={currentWeek}
              />
            </motion.div>
          )}

          {/* Milestones */}
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <MilestoneTracker 
                milestones={milestones}
                currentWeek={currentWeek}
              />
            </motion.div>
          )}

          {/* Epilepsy-Specific Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Epilepsy & Pregnancy Guidance</h3>
                <p className="text-sm text-gray-600">Important considerations for your healthcare team</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Pre-Pregnancy Planning</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Pre-pregnancy counseling with neurologist and OB-GYN</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Folic acid supplementation (5mg daily) before conception</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Medication optimization if possible</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">During Pregnancy</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Regular medication level monitoring</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Detailed anomaly scan at 18-20 weeks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Multidisciplinary team approach</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-900 mb-1">Important Notice</h5>
                  <p className="text-sm text-blue-800">
                    This information is for educational purposes only. Always consult your healthcare provider 
                    for personalized medical advice. Individual situations may vary.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
