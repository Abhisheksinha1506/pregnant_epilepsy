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
  Filter
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
    // Load seizures from localStorage
    const savedSeizures = localStorage.getItem('seizures')
    if (savedSeizures) {
      setSeizures(JSON.parse(savedSeizures))
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
    const dataStr = JSON.stringify(seizures, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `seizure-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported successfully')
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

          {/* Stats Cards */}
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
                  <p className="text-sm text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.filter(s => {
                      const seizureDate = new Date(s.date)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return seizureDate >= weekAgo
                    }).length}
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
                  <p className="text-sm text-gray-600">Severe Seizures</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.filter(s => s.severity >= 4).length}
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
                  <p className="text-sm text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {seizures.length > 0 
                      ? Math.round(seizures.reduce((acc, s) => acc + s.duration, 0) / seizures.length)
                      : 0
                    }m
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
          </div>

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
