'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useState } from 'react'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

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

interface SeizureChartProps {
  seizures: Seizure[]
}

export default function SeizureChart({ seizures }: SeizureChartProps) {
  const [chartType, setChartType] = useState<'frequency' | 'severity' | 'duration'>('frequency')

  // Process data for charts
  const processData = () => {
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)
    
    const dailyData: { [key: string]: any } = {}
    
    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyData[dateStr] = {
        date: dateStr,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        frequency: 0,
        severity: 0,
        duration: 0,
        count: 0
      }
    }
    
    // Add seizure data
    seizures.forEach(seizure => {
      const seizureDate = seizure.date
      if (dailyData[seizureDate]) {
        dailyData[seizureDate].frequency += 1
        dailyData[seizureDate].severity += seizure.severity
        dailyData[seizureDate].duration += seizure.duration
        dailyData[seizureDate].count += 1
      }
    })
    
    // Calculate averages
    Object.values(dailyData).forEach((day: any) => {
      if (day.count > 0) {
        day.severity = Math.round(day.severity / day.count)
        day.duration = Math.round(day.duration / day.count)
      }
    })
    
    return Object.values(dailyData)
  }

  const chartData = processData()

  const getChartContent = () => {
    switch (chartType) {
      case 'frequency':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="frequency" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )
      case 'severity':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="severity" 
              fill="#ef4444"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )
      case 'duration':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="duration" 
              fill="#10b981"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        )
    }
  }

  if (seizures.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Seizure Data Yet</h3>
        <p className="text-gray-600">
          Start logging your seizures to see helpful charts and patterns.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Seizure Analytics</h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('frequency')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'frequency'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Frequency
          </button>
          <button
            onClick={() => setChartType('severity')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'severity'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Severity
          </button>
          <button
            onClick={() => setChartType('duration')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'duration'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Duration
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {getChartContent()}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Frequency</span>
          </div>
          <p className="text-xs text-blue-700">
            Number of seizures per day over the last 30 days
          </p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Severity</span>
          </div>
          <p className="text-xs text-red-700">
            Average seizure severity (1-5 scale) per day
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Duration</span>
          </div>
          <p className="text-xs text-green-700">
            Average seizure duration in minutes per day
          </p>
        </div>
      </div>
    </div>
  )
}
