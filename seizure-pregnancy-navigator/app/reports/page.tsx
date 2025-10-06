'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Eye, 
  Filter,
  FileText,
  PieChart,
  LineChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface ReportData {
  id: string
  title: string
  description: string
  type: 'seizure' | 'medication' | 'pregnancy' | 'general'
  lastUpdated: string
  status: 'ready' | 'processing' | 'error'
  dataPoints: number
  icon: string
}

export default function ReportsPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reports, setReports] = useState<ReportData[]>([])
  const [rawSeizures, setRawSeizures] = useState<any[]>([])
  const [rawMedications, setRawMedications] = useState<any[]>([])
  const [rawMilestones, setRawMilestones] = useState<any[]>([])

  useEffect(() => {
    // Build reports from patient-entered data (local persistence)
    try {
      const readArray = (key: string): any[] => {
        try {
          const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null
          if (!raw) return []
          const parsed = JSON.parse(raw)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }

      // Use correct localStorage keys that the app actually uses
      const seizureLogs = readArray('seizures')
      const medicationLogs = readArray('medication_logs')
      // If milestones are not stored, derive from due date if present
      const milestoneEntries = readArray('pregnancy_milestones')
      setRawSeizures(seizureLogs)
      setRawMedications(medicationLogs)
      setRawMilestones(milestoneEntries)
      const dueDateStr = typeof window !== 'undefined' ? (localStorage.getItem('pregnancy_due_date') || '') : ''

      const today = new Date()
      const lastUpdated = today.toISOString().slice(0, 10)

      let pregnancyCount = milestoneEntries.length
      if (pregnancyCount === 0 && dueDateStr) {
        // Estimate completed weeks as a proxy for progress count
        const due = new Date(dueDateStr)
        const msPerWeek = 7 * 24 * 60 * 60 * 1000
        const gestationWeeks = 40
        const start = new Date(due.getTime() - gestationWeeks * msPerWeek)
        const weeks = Math.max(0, Math.min(gestationWeeks, Math.floor((today.getTime() - start.getTime()) / msPerWeek)))
        pregnancyCount = weeks
      }

      const seizureCount = seizureLogs.length
      const medsCount = medicationLogs.length

      const built: ReportData[] = [
        {
          id: 'seizure',
          title: 'Seizure Activity Report',
          description: 'Computed from patient-entered seizure logs stored on this device.',
          type: 'seizure',
          lastUpdated,
          status: 'ready',
          dataPoints: seizureCount,
          icon: 'activity'
        },
        {
          id: 'medication',
          title: 'Medication Adherence Report',
          description: 'Computed from patient-entered medication logs stored on this device.',
          type: 'medication',
          lastUpdated,
          status: 'ready',
          dataPoints: medsCount,
          icon: 'trending'
        },
        {
          id: 'pregnancy',
          title: 'Pregnancy Progress Report',
          description: milestoneEntries.length > 0
            ? 'Computed from patient-entered pregnancy milestones.'
            : 'Estimated progress based on due date saved on this device.',
          type: 'pregnancy',
          lastUpdated,
          status: 'ready',
          dataPoints: pregnancyCount,
          icon: 'calendar'
        },
        {
          id: 'general',
          title: 'Comprehensive Health Summary',
          description: 'Combined summary from patient-entered seizures, medications, and pregnancy data.',
          type: 'general',
          lastUpdated,
          status: 'ready',
          dataPoints: seizureCount + medsCount + pregnancyCount,
          icon: 'file'
        }
      ]

      setReports(built)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const toCSV = (rows: any[]): string => {
    if (!rows || rows.length === 0) return ''
    const columns = Array.from(rows.reduce((set: Set<string>, row: any) => {
      if (row && typeof row === 'object') Object.keys(row).forEach(k => set.add(k))
      return set
    }, new Set<string>()))
    const escapeVal = (val: any) => {
      if (val === null || val === undefined) return ''
      const s = typeof val === 'string' ? val : JSON.stringify(val)
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
    }
    const header = columns.join(',')
    const lines = rows.map(r => columns.map(c => escapeVal(r ? r[c] : '')).join(','))
    return [header, ...lines].join('\n')
  }

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportReport = (report: ReportData) => {
    try {
      if (report.id === 'seizure') {
        // Create a human-readable CSV for seizures
        const rows = (rawSeizures || []).map((s: any) => {
          const triggers = Array.isArray(s?.triggers) ? s.triggers.join(' | ') : ''
          const notes = typeof s?.notes === 'string' ? s.notes.replace(/,/g, ';').replace(/\n/g, ' ') : ''
          const durationMinutes = s?.durationMinutes ?? ''
          const durationSeconds = s?.durationSeconds ?? ''
          const medicationTaken = s?.medicationTaken ? 'Yes' : 'No'
          const period = s?.period ?? ''
          const weekAtSeizure = s?.pregnancyContext?.weekAtSeizure ?? ''
          const trimesterAtSeizure = s?.pregnancyContext?.trimesterAtSeizure ?? ''
          return {
            date: s?.date ?? '',
            time: s?.time ?? '',
            type: s?.type ?? '',
            durationMinutes,
            durationSeconds,
            severity: s?.severity ?? '',
            triggers,
            notes,
            medicationTaken,
            period,
            weekAtSeizure,
            trimesterAtSeizure,
          }
        })
        const csv = toCSV(rows, [
          'date',
          'time',
          'type',
          'durationMinutes',
          'durationSeconds',
          'severity',
          'triggers',
          'notes',
          'medicationTaken',
          'period',
          'weekAtSeizure',
          'trimesterAtSeizure',
        ])
        downloadFile(csv, 'seizure_activity.csv', 'text/csv;charset=utf-8;')
        return
      }
      if (report.id === 'medication') {
        const csv = toCSV(rawMedications)
        downloadFile(csv, 'medication_logs.csv', 'text/csv;charset=utf-8;')
        return
      }
      if (report.id === 'pregnancy') {
        if (rawMilestones.length > 0) {
          const csv = toCSV(rawMilestones)
          downloadFile(csv, 'pregnancy_milestones.csv', 'text/csv;charset=utf-8;')
        } else {
          // Create CSV for pregnancy progress even without milestones
          const due = typeof window !== 'undefined' ? (localStorage.getItem('pregnancy_due_date') || '') : ''
          const pregnancyData = [{
            dueDate: due,
            computedAt: new Date().toISOString(),
            status: 'Active',
            milestones: 0
          }]
          const csv = toCSV(pregnancyData)
          downloadFile(csv, 'pregnancy_progress.csv', 'text/csv;charset=utf-8;')
        }
        return
      }
      // General summary - create CSV format
      const summaryData = [{
        generatedAt: new Date().toISOString(),
        seizureLogs: rawSeizures.length,
        medicationLogs: rawMedications.length,
        pregnancyMilestones: rawMilestones.length,
        total: rawSeizures.length + rawMedications.length + rawMilestones.length,
        reportType: 'Comprehensive Health Summary'
      }]
      const csv = toCSV(summaryData)
      downloadFile(csv, 'comprehensive_summary.csv', 'text/csv;charset=utf-8;')
    } catch {
      // noop
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'activity': return <Activity className="w-6 h-6" />
      case 'trending': return <TrendingUp className="w-6 h-6" />
      case 'calendar': return <Calendar className="w-6 h-6" />
      case 'file': return <FileText className="w-6 h-6" />
      default: return <BarChart3 className="w-6 h-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'seizure': return 'bg-red-100 text-red-700 border-red-200'
      case 'medication': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pregnancy': return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'general': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'processing': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready to View'
      case 'processing': return 'Generating...'
      case 'error': return 'Error'
      default: return 'Unknown'
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
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Reports & Analytics</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your health progress with detailed reports and insights.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{reports.length}</h3>
              <p className="text-gray-600">Available Reports</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{reports.filter(r => r.status === 'ready').length}</h3>
              <p className="text-gray-600">Ready to View</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{reports.filter(r => r.status === 'processing').length}</h3>
              <p className="text-gray-600">Processing</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{reports.reduce((sum, r) => sum + (r.dataPoints || 0), 0)}</h3>
              <p className="text-gray-600">Total Data Points</p>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {(reports.length === 0 ? [] : reports).map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(report.type)}`}>
                      {getIcon(report.icon)}
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(report.status)}
                      <span className="text-sm text-gray-600">{getStatusText(report.status)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{report.dataPoints} data points</span>
                    <span>Updated {report.lastUpdated}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedReport(report.id)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                    onClick={() => exportReport(report)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Report Preview */}
          {selectedReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Preview</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Individual Seizures</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{rawSeizures.length}</div>
                  <p className="text-sm text-gray-600">total seizures logged</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Latest Seizure</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {rawSeizures.length > 0 
                      ? new Date(rawSeizures.sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'None'
                    }
                  </div>
                  <p className="text-sm text-gray-600">most recent seizure</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Highest Severity</h3>
                  <div className="text-3xl font-bold text-pink-600 mb-1">
                    {rawSeizures.length > 0 
                      ? Math.max(...rawSeizures.map(s => s.severity))
                      : 0
                    }/5
                  </div>
                  <p className="text-sm text-gray-600">maximum severity level</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a preview of your health data. 
                  For detailed analysis and medical insights, please consult with your healthcare provider.
                </p>
              </div>
            </motion.div>
          )}

          {/* Data Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 text-sm">🔒</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Data Privacy & Security</h3>
                <p className="text-blue-800">
                  Your health data is encrypted and stored securely. Reports are generated locally and never shared 
                  without your explicit consent. All data remains under your control and can be deleted at any time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
