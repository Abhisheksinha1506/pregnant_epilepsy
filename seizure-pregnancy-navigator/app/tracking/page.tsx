'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Download,
  Filter,
  Trash2
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import SeizureLogForm from '@/components/SeizureLogForm'
import SeizureChart from '@/components/SeizureChart'
import SeizureList from '@/components/SeizureList'
import { toast } from 'react-hot-toast'

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

export default function TrackingPage() {
  const [seizures, setSeizures] = useState<Seizure[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load seizures from localStorage with validation
    const savedSeizures = localStorage.getItem('seizures')
    if (savedSeizures) {
      try {
        const parsedSeizures = JSON.parse(savedSeizures)
        
        // Validate and filter out corrupted data
        const validSeizures = parsedSeizures.filter((seizure: Seizure) => {
          // Check for reasonable duration values
          const minutes = seizure.durationMinutes || 0
          const seconds = seizure.durationSeconds || 0
          const totalDuration = seizure.duration || 0
          
          // Filter out extreme values
          if (minutes > 60 || seconds > 59 || totalDuration > 60) {
            console.warn('Filtered out corrupted seizure data:', seizure)
            return false
          }
          
          // Filter out negative values
          if (minutes < 0 || seconds < 0 || totalDuration < 0) {
            console.warn('Filtered out invalid seizure data:', seizure)
            return false
          }
          
          return true
        })
        
        // If we filtered out data, update localStorage
        if (validSeizures.length !== parsedSeizures.length) {
          console.log(`🧹 Filtered out ${parsedSeizures.length - validSeizures.length} corrupted seizures`)
          localStorage.setItem('seizures', JSON.stringify(validSeizures))
        }
        
        setSeizures(validSeizures)
      } catch (error) {
        console.error('Error parsing seizure data:', error)
        // Clear corrupted data
        localStorage.removeItem('seizures')
        setSeizures([])
      }
    }
    setIsLoaded(true)
  }, [])

  const addSeizure = (seizure: Omit<Seizure, 'id'>) => {
    const newSeizure: Seizure = {
      ...seizure,
      id: Date.now().toString()
    }
    const updatedSeizures = [...seizures, newSeizure]
    setSeizures(updatedSeizures)
    localStorage.setItem('seizures', JSON.stringify(updatedSeizures))
    setShowForm(false)
    toast.success('Seizure logged successfully')
  }

  const deleteSeizure = (id: string) => {
    const updatedSeizures = seizures.filter(seizure => seizure.id !== id)
    setSeizures(updatedSeizures)
    localStorage.setItem('seizures', JSON.stringify(updatedSeizures))
    toast.success('Seizure deleted')
  }

  const filteredSeizures = seizures.filter(seizure => {
    if (filter === 'all') return true
    if (filter === 'recent') {
      const seizureDate = new Date(seizure.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return seizureDate >= weekAgo
    }
    if (filter === 'severe') return seizure.severity >= 4
    return true
  })

  const exportData = () => {
    // Convert seizures to CSV format
    const csvHeaders = 'Date,Time,Type,Duration (minutes),Duration (seconds),Severity,Triggers,Notes,Medication Taken\n'
    const csvRows = seizures.map(seizure => {
      const triggers = seizure.triggers.join('; ')
      const notes = seizure.notes.replace(/,/g, ';').replace(/\n/g, ' ')
      const medicationTaken = seizure.medicationTaken ? 'Yes' : 'No'
      const durationMinutes = seizure.durationMinutes || 0
      const durationSeconds = seizure.durationSeconds || 0
      
      return `"${seizure.date}","${seizure.time}","${seizure.type}","${durationMinutes}","${durationSeconds}","${seizure.severity}","${triggers}","${notes}","${medicationTaken}"`
    }).join('\n')
    
    const csvContent = csvHeaders + csvRows
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `seizure-data-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported as CSV successfully')
  }

  const clearAllData = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      '⚠️ WARNING: This will permanently delete ALL your seizure data.\n\n' +
      'This action cannot be undone. Are you sure you want to continue?\n\n' +
      'Consider exporting your data first if you want to keep a backup.'
    )
    
    if (confirmed) {
      // Clear all localStorage data
      localStorage.removeItem('seizures')
      localStorage.removeItem('seizure_logs')
      localStorage.removeItem('medication_logs')
      localStorage.removeItem('pregnancy_milestones')
      localStorage.removeItem('dueDate')
      localStorage.removeItem('pregnancy_due_date')
      localStorage.removeItem('pregnancy_start_date')
      localStorage.removeItem('pregnancy_start_date_type')
      localStorage.removeItem('pregnancy_status')
      
      // Clear state
      setSeizures([])
      
      // Show success message
      toast.success('All data cleared successfully')
      
      // Log the action
      console.log('🧹 All localStorage data cleared by user')
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seizure Tracking</h1>
            <p className="text-gray-600">
              Monitor your seizures to help your healthcare team provide the best care for you and your baby.
            </p>
          </div>

          {/* Individual Seizure Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Seizures</p>
                  <p className="text-2xl font-bold text-gray-900">{seizures.length}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Latest Seizure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.length > 0 
                      ? new Date(seizures.sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'None'
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Highest Severity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.length > 0 
                      ? Math.max(...seizures.map(s => s.severity))
                      : 0
                    }/5
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Longest Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.length > 0 
                      ? Math.max(...seizures.map(s => s.duration)).toFixed(1)
                      : 0
                    }m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
          </div>

          {/* Data Management Warning */}
          {seizures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">Data Management</h4>
                  <p className="text-xs text-yellow-700">
                    You have {seizures.length} seizure{seizures.length !== 1 ? 's' : ''} logged. 
                    Consider exporting your data before clearing to keep a backup.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Log New Seizure</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={exportData}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              onClick={clearAllData}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Data</span>
            </motion.button>
          </div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6"
          >
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Seizures</option>
                <option value="recent">Last 7 Days</option>
                <option value="severe">Severe (4-5)</option>
              </select>
            </div>
          </motion.div>

          {/* Chart */}
          {seizures.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <SeizureChart seizures={filteredSeizures} />
            </motion.div>
          )}

          {/* Seizure List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <SeizureList 
              seizures={filteredSeizures} 
              onDelete={deleteSeizure}
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Seizure Log Form Modal */}
      {showForm && (
        <SeizureLogForm
          onClose={() => setShowForm(false)}
          onSubmit={addSeizure}
        />
      )}
    </div>
  )
}
