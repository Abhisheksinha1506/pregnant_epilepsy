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
  TrendingUp,
  Activity,
  BarChart3,
  Pill,
  FileText,
  BookOpen,
  Plus,
  Download,
  Trash2
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import PregnancyProgress from '@/components/PregnancyProgress'
import TrimesterCard from '@/components/TrimesterCard'
import MilestoneTracker from '@/components/MilestoneTracker'
import SeizureLogForm from '@/components/SeizureLogForm'
import SeizureList from '@/components/SeizureList'
import SeizureChart from '@/components/SeizureChart'
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
  period?: 'pre_pregnancy' | 'pregnancy' | 'postpartum'
  pregnancyContext?: {
    statusAtLog: string
    startDate: string | null
    dueDate: string | null
    weekAtSeizure: number | null
    trimesterAtSeizure: number | null
  }
}

export default function PregnancyPage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [pregnancyStartDate, setPregnancyStartDate] = useState('')
  const [pregnancyStatus, setPregnancyStatus] = useState<'planning' | 'pregnant' | 'postpartum' | 'miscarriage'>('planning')
  const [startDateType, setStartDateType] = useState<'conception' | 'discovery'>('conception')
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'knowledge' | 'seizures' | 'medications' | 'reports'>('overview')
  const [seizures, setSeizures] = useState<Seizure[]>([])
  const [showSeizureForm, setShowSeizureForm] = useState(false)

  useEffect(() => {
    // Load pregnancy data from localStorage
    const savedDueDate = localStorage.getItem('pregnancy_due_date') || localStorage.getItem('dueDate')
    const savedStartDate = localStorage.getItem('pregnancy_start_date')
    const savedStatus = localStorage.getItem('pregnancy_status') as any || 'planning'
    
    if (savedStartDate) {
      setPregnancyStartDate(savedStartDate)
      setPregnancyStatus(savedStatus)
      calculateCurrentWeek(savedStartDate, savedStatus)
    } else if (savedDueDate) {
      setDueDate(savedDueDate)
      calculateCurrentWeekFromDueDate(savedDueDate)
    }
    
    // Load seizures from localStorage
    loadSeizures()
    setIsLoaded(true)
  }, [])

  const loadSeizures = () => {
    try {
      const savedSeizures = localStorage.getItem('seizures')
      if (savedSeizures) {
        const parsedSeizures = JSON.parse(savedSeizures)
        // Normalize older entries that may be missing period/pregnancyContext
        const startStr = localStorage.getItem('pregnancy_start_date')
        const dueStr = localStorage.getItem('pregnancy_due_date') || localStorage.getItem('dueDate')
        const statusStr = (localStorage.getItem('pregnancy_status') as string) || 'planning'
        const start = startStr ? new Date(startStr) : null
        const due = dueStr ? new Date(dueStr) : null

        let changed = false
        const normalized = parsedSeizures.map((s: any) => {
          const copy = { ...s }
          const seizureDate = copy.date ? new Date(copy.date) : null

          // Determine/repair period
          if (!copy.period) {
            if (copy.phaseOverride === 'pre_pregnancy' || copy.phaseOverride === 'pregnancy' || copy.phaseOverride === 'postpartum') {
              copy.period = copy.phaseOverride
            } else if (seizureDate && start) {
              if (seizureDate < start) copy.period = 'pre_pregnancy'
              else if (due && seizureDate > due) copy.period = 'postpartum'
              else copy.period = 'pregnancy'
            } else {
              copy.period = statusStr === 'pregnant' ? 'pregnancy' : (statusStr === 'postpartum' ? 'postpartum' : 'pre_pregnancy')
            }
            changed = true
          }

          // Ensure pregnancyContext
          if (!copy.pregnancyContext) {
            let weekAtSeizure: number | null = null
            let trimesterAtSeizure: number | null = null
            if (start && seizureDate) {
              const diffTime = seizureDate.getTime() - start.getTime()
              const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
              weekAtSeizure = Math.max(0, weeks)
              if (weekAtSeizure <= 0) trimesterAtSeizure = 0
              else if (weekAtSeizure <= 12) trimesterAtSeizure = 1
              else if (weekAtSeizure <= 26) trimesterAtSeizure = 2
              else if (weekAtSeizure <= 40) trimesterAtSeizure = 3
              else trimesterAtSeizure = 4
            }
            copy.pregnancyContext = {
              statusAtLog: statusStr,
              startDate: startStr || null,
              dueDate: dueStr || null,
              weekAtSeizure,
              trimesterAtSeizure
            }
            changed = true
          }

        
          return copy
        })

        if (changed) {
          localStorage.setItem('seizures', JSON.stringify(normalized))
          setSeizures(normalized)
        } else {
          setSeizures(parsedSeizures)
        }
      }
    } catch (error) {
      console.error('Error loading seizures:', error)
      setSeizures([])
    }
  }

  const calculateCurrentWeek = (startDateStr: string, status: string) => {
    if (status === 'planning' || status === 'miscarriage') {
      setCurrentWeek(0)
      return
    }
    
    const startDate = new Date(startDateStr)
    const today = new Date()
    const diffTime = today.getTime() - startDate.getTime()
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    
    // Pregnancy weeks start from 1, not 0
    // If it's been less than a week, you're in week 1
    const currentWeek = Math.max(1, Math.min(42, diffWeeks + 1))
    setCurrentWeek(currentWeek)
    
    // Auto-calculate due date if not set
    if (!dueDate && status === 'pregnant') {
      const calculatedDueDate = new Date(startDate.getTime() + (280 * 24 * 60 * 60 * 1000))
      const dueDateStr = calculatedDueDate.toISOString().split('T')[0]
      setDueDate(dueDateStr)
      localStorage.setItem('pregnancy_due_date', dueDateStr)
    }
  }

  const calculateCurrentWeekFromDueDate = (dueDateStr: string) => {
    const due = new Date(dueDateStr)
    const today = new Date()
    
    // Calculate weeks from conception (due date - 280 days)
    const conceptionDate = new Date(due.getTime() - (280 * 24 * 60 * 60 * 1000))
    const diffTime = today.getTime() - conceptionDate.getTime()
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
    
    // Pregnancy weeks start from 1, not 0
    const currentWeek = Math.max(1, Math.min(42, diffWeeks + 1))
    setCurrentWeek(currentWeek)
  }

  const handlePregnancyStart = (startDate: string, status: string) => {
    console.log('🔍 handlePregnancyStart called:', { startDate, status })
    setPregnancyStartDate(startDate)
    setPregnancyStatus(status as any)
    localStorage.setItem('pregnancy_start_date', startDate)
    localStorage.setItem('pregnancy_status', status)
    calculateCurrentWeek(startDate, status)
    console.log('✅ Pregnancy start data saved:', { startDate, status })
  }

  const handleDueDateChange = (newDueDate: string) => {
    setDueDate(newDueDate)
    localStorage.setItem('pregnancy_due_date', newDueDate)
    localStorage.setItem('dueDate', newDueDate) // Keep both for compatibility
    calculateCurrentWeekFromDueDate(newDueDate)
  }

  const getTrimester = (week: number) => {
    if (week <= 0) return 0 // Pre-pregnancy
    if (week <= 12) return 1 // First trimester (weeks 1-12)
    if (week <= 26) return 2 // Second trimester (weeks 13-26)
    if (week <= 40) return 3 // Third trimester (weeks 27-40)
    return 4 // Post-term (beyond 40 weeks)
  }

  const getTrimesterInfo = (trimester: number) => {
    switch (trimester) {
      case 0:
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
      case 4:
        return {
          title: "Post-Term",
          weeks: "Beyond 40 weeks",
          color: "bg-red-500",
          description: "Post-term pregnancy monitoring",
          keyPoints: [
            "Increased monitoring required",
            "Discuss induction options",
            "Close monitoring for complications",
            "Prepare for delivery"
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

  const addSeizure = (seizure: Omit<Seizure, 'id'>) => {
    try {
      const saved = localStorage.getItem('seizures')
      const existing = saved ? JSON.parse(saved) : []
      
      // Determine time period based on seizure date vs pregnancy dates
      const seizureDate = new Date(seizure.date)
      const start = pregnancyStartDate ? new Date(pregnancyStartDate) : null
      const due = dueDate ? new Date(dueDate) : null

      let period: 'pre_pregnancy' | 'pregnancy' | 'postpartum' = 'pre_pregnancy'
      if (start) {
        if (seizureDate < start) {
          period = 'pre_pregnancy'
        } else if (due && seizureDate > due) {
          period = 'postpartum'
        } else if (!due || (seizureDate >= start && seizureDate <= due)) {
          period = 'pregnancy'
        }
      } else {
        // No start date set; fall back to current status
        period = pregnancyStatus === 'pregnant' ? 'pregnancy' : (pregnancyStatus === 'postpartum' ? 'postpartum' : 'pre_pregnancy')
      }

      // Compute week/trimester at seizure time if start is known
      let weekAtSeizure: number | null = null
      let trimesterAtSeizure: number | null = null
      if (start) {
        const diffTime = seizureDate.getTime() - start.getTime()
        const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
        weekAtSeizure = Math.max(0, weeks)
        // Use same trimester logic
        if (weekAtSeizure <= 0) trimesterAtSeizure = 0
        else if (weekAtSeizure <= 12) trimesterAtSeizure = 1
        else if (weekAtSeizure <= 26) trimesterAtSeizure = 2
        else if (weekAtSeizure <= 40) trimesterAtSeizure = 3
        else trimesterAtSeizure = 4
      }

      const newSeizure: Seizure = {
        ...seizure,
        id: Date.now().toString(),
        period, // pre_pregnancy | pregnancy | postpartum
        pregnancyContext: {
          statusAtLog: pregnancyStatus,
          startDate: pregnancyStartDate || null,
          dueDate: dueDate || null,
          weekAtSeizure,
          trimesterAtSeizure
        }
      }
      
      const updated = [...existing, newSeizure]
      localStorage.setItem('seizures', JSON.stringify(updated))
      setSeizures(updated)
      setShowSeizureForm(false)
      toast.success('Seizure logged successfully')
    } catch (error) {
      console.error('Failed to save seizure:', error)
      toast.error('Failed to save seizure')
    }
  }

  const deleteSeizure = (id: string) => {
    const updatedSeizures = seizures.filter(seizure => seizure.id !== id)
    setSeizures(updatedSeizures)
    localStorage.setItem('seizures', JSON.stringify(updatedSeizures))
    toast.success('Seizure deleted')
  }

  const exportSeizureData = () => {
    if (seizures.length === 0) {
      toast.error('No seizure data to export')
      return
    }

    const csvHeaders = 'Date,Time,Type,Duration (minutes),Duration (seconds),Severity,Triggers,Notes,Medication Taken,Pregnancy Period,Week at Seizure,Trimester at Seizure\n'
    const csvRows = seizures.map(seizure => {
      const triggers = seizure.triggers.join('; ')
      const notes = seizure.notes.replace(/,/g, ';').replace(/\n/g, ' ')
      const medicationTaken = seizure.medicationTaken ? 'Yes' : 'No'
      const durationMinutes = seizure.durationMinutes || 0
      const durationSeconds = seizure.durationSeconds || 0
      const period = seizure.period || 'unknown'
      const weekAtSeizure = seizure.pregnancyContext?.weekAtSeizure || ''
      const trimesterAtSeizure = seizure.pregnancyContext?.trimesterAtSeizure || ''
      
      return `"${seizure.date}","${seizure.time}","${seizure.type}","${durationMinutes}","${durationSeconds}","${seizure.severity}","${triggers}","${notes}","${medicationTaken}","${period}","${weekAtSeizure}","${trimesterAtSeizure}"`
    }).join('\n')
    
    const csvContent = csvHeaders + csvRows
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `seizure-data-pregnancy-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Seizure data exported successfully')
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pregnancy Tracker</h1>
            <p className="text-gray-600">
              Track your pregnancy journey with epilepsy-specific guidance and milestones.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Overview</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('seizures')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'seizures'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4" />
                    <span>Seizures ({seizures.length})</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'knowledge'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Knowledge</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('medications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'medications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Pill className="w-4 h-4" />
                    <span>Medications</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Reports</span>
              </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
          {/* Pregnancy Status Setup */}
          {(!pregnancyStartDate || pregnancyStatus === 'planning') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Status</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handlePregnancyStart('', 'planning')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      pregnancyStatus === 'planning' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Pre-Pregnancy Planning</h4>
                        <p className="text-sm text-gray-600">Planning to conceive</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0]
                      handlePregnancyStart(today, 'pregnant')
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      pregnancyStatus === 'pregnant' 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <Baby className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">Currently Pregnant</h4>
                        <p className="text-sm text-gray-600">Start tracking from today</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Custom Start Date */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Or enter your pregnancy start date:</h4>
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <input
                      type="date"
                      value={pregnancyStartDate}
                      onChange={(e) => {
                        if (e.target.value) {
                          handlePregnancyStart(e.target.value, 'pregnant')
                        }
                      }}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">
                      When did your pregnancy begin?
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

                {/* Seizures by Phase Snapshot (moved to top for visibility) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Seizures by Phase</h3>
                    <button
                      onClick={() => setActiveTab('seizures')}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(() => {
                      const pre = seizures.filter(s => s.period === 'pre_pregnancy')
                      const preg = seizures.filter(s => s.period === 'pregnancy')
                      const post = seizures.filter(s => s.period === 'postpartum')
                      const latestDate = (arr: typeof seizures) => arr.length
                        ? new Date([...arr].sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())[0].date)
                            .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'None'
                      const maxSeverity = (arr: typeof seizures) => arr.length ? Math.max(...arr.map(s => s.severity)) : 0

                      const cards = [
                        { title: 'Pre-pregnancy', count: pre.length, latest: latestDate(pre), severity: maxSeverity(pre), color: 'bg-gray-50' },
                        { title: 'Pregnancy', count: preg.length, latest: latestDate(preg), severity: maxSeverity(preg), color: 'bg-pink-50' },
                        { title: 'Postpartum', count: post.length, latest: latestDate(post), severity: maxSeverity(post), color: 'bg-purple-50' }
                      ]
                      return cards.map(card => (
                        <div key={card.title} className={`${card.color} rounded-lg p-4 border border-gray-200`}>
                          <p className="text-sm text-gray-600">{card.title}</p>
                          <div className="flex items-baseline justify-between mt-1">
                            <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                            <span className="text-xs text-gray-500">sev {card.severity}/5</span>
                  </div>
                          <p className="text-xs text-gray-500 mt-1">Latest: {card.latest}</p>
                </div>
                      ))
                    })()}
              </div>
            </motion.div>

          {/* Current Progress */}
          {(pregnancyStartDate || dueDate) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PregnancyProgress 
                currentWeek={currentWeek}
                dueDate={dueDate}
                trimester={currentTrimester}
                pregnancyStatus={pregnancyStatus}
                pregnancyStartDate={pregnancyStartDate}
                onStatusChange={(newStatus) => {
                  if (pregnancyStartDate) {
                    handlePregnancyStart(pregnancyStartDate, newStatus)
                  }
                }}
              />
            </motion.div>
          )}

                {/* Trimester info moved to Knowledge tab */}

          {/* Milestones */}
          {dueDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MilestoneTracker 
                milestones={milestones}
                currentWeek={currentWeek}
              />
            </motion.div>
          )}

                {/* Guidance moved to Knowledge tab */}

                {/* Seizures by Phase Snapshot (duplicate removed below) */}
              </div>
            )}

            {activeTab === 'seizures' && (
              <div className="space-y-8">
                {/* Seizure Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  onClick={() => setShowSeizureForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Log New Seizure</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    onClick={exportSeizureData}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Export Data</span>
                  </motion.button>
                </div>

                {/* Seizure Chart */}
                {seizures.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <SeizureChart seizures={seizures} />
                  </motion.div>
                )}

                {/* Seizure List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <SeizureList 
                    seizures={seizures} 
                    onDelete={deleteSeizure}
                  />
                </motion.div>
              </div>
            )}

            {activeTab === 'medications' && (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Pill className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Medication Safety</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Check the safety of epilepsy medications during pregnancy. Always consult your doctor before making any changes.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-blue-900 mb-1">Important Notice</h5>
                        <p className="text-sm text-blue-800">
                          This information is for educational purposes only. Always consult your healthcare provider 
                          before making any changes to your medications. Individual medical situations may vary.
                        </p>
                      </div>
                    </div>
                </div>
                  <div className="mt-6">
                    <a 
                      href="/medications" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Pill className="w-4 h-4 mr-2" />
                      View Medication Safety Database
                    </a>
            </div>
          </motion.div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Reports & Analytics</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Generate comprehensive reports to share with your healthcare providers.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Seizure Activity Report</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Detailed seizure data with pregnancy context
                      </p>
                      <button
                        onClick={exportSeizureData}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Pregnancy Progress Report</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Milestone tracking and trimester progress
                      </p>
                      <a 
                        href="/reports" 
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors space-x-2"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Reports</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 }}
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

                  {/* Pre-Pregnancy – Planning Phase Summary */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Pre-Pregnancy</h4>
                      <div className="text-xs text-gray-600 mb-2">Planning Phase</div>
                      <p className="text-sm text-gray-700">Pre-pregnancy planning and optimization</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Focus Areas</h4>
                      <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                        <li>Pre-pregnancy counseling</li>
                        <li>Medication optimization</li>
                        <li>Folic acid supplementation</li>
                        <li>Risk assessment and planning</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Epilepsy Considerations</h4>
                      <div className="text-sm text-blue-800">
                        <span className="font-medium">Important Reminder:</span> Always consult your healthcare provider before making any changes to your medications. This information is for educational purposes only and does not replace professional medical advice.
                      </div>
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
              </div>
            )}
          </motion.div>

          {/* Seizure Log Form Modal */}
          {showSeizureForm && (
            <SeizureLogForm
              onClose={() => setShowSeizureForm(false)}
              onSubmit={addSeizure}
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}
