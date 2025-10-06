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
  durationMinutes?: number
  durationSeconds?: number
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
  const [showDetailedView, setShowDetailedView] = useState(false)

  // Process data for charts - now shows individual seizures instead of aggregated data
  const processData = () => {
    if (seizures.length === 0) return []
    
    // Create individual data points for each seizure
    return seizures
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
      .map((seizure, index) => {
        const seizureDateTime = new Date(`${seizure.date} ${seizure.time}`)
        return {
          date: seizure.date,
          time: seizure.time,
          displayDate: seizureDateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          displayTime: seizureDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          frequency: 1, // Each seizure is 1 occurrence
          severity: seizure.severity,
          duration: seizure.duration,
          durationMinutes: seizure.durationMinutes || 0,
          durationSeconds: seizure.durationSeconds || 0,
          type: seizure.type,
          index: index + 1,
          seizureId: seizure.id
        }
      })
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
              label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Seizure Count', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `${props.payload.displayDate} at ${props.payload.displayTime} - ${props.payload.type}`,
                'Seizure Count'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="frequency" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        )
      case 'severity':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 5]}
              label={{ value: 'Severity Level', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `${props.payload.displayDate} at ${props.payload.displayTime} - ${props.payload.type}`,
                'Severity Level'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="severity" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        )
      case 'duration':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `${props.payload.displayDate} at ${props.payload.displayTime} - ${props.payload.type}`,
                'Duration (minutes)'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="duration" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
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
            Frequency Trend
          </button>
          <button
            onClick={() => setChartType('severity')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'severity'
                ? 'bg-red-100 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Severity Trend
          </button>
          <button
            onClick={() => setChartType('duration')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'duration'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Duration Trend
          </button>
          <button
            onClick={() => setShowDetailedView(!showDetailedView)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showDetailedView
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {showDetailedView ? 'Chart View' : 'Detailed View'}
          </button>
        </div>
      </div>

      {showDetailedView ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Individual seizures with timestamps and details
          </div>
          <div className="max-h-80 overflow-y-auto space-y-3">
            {seizures
              .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())
              .map((seizure, index) => (
                <div key={seizure.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(seizure.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {seizure.time}
                        </div>
                        <div className="text-sm text-gray-600">{seizure.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {seizure.durationMinutes > 0 && seizure.durationSeconds > 0 
                          ? `${seizure.durationMinutes}m ${seizure.durationSeconds}s`
                          : seizure.durationMinutes > 0 
                            ? `${seizure.durationMinutes}m`
                            : `${seizure.durationSeconds}s`
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        Severity: {seizure.severity}/5
                      </div>
                    </div>
                  </div>
                  {seizure.triggers.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {seizure.triggers.map((trigger, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {trigger}
                        </span>
                      ))}
                    </div>
                  )}
                  {seizure.notes && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border">
                      <strong>Notes:</strong> {seizure.notes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {getChartContent()}
          </ResponsiveContainer>
        </div>
      )}

      {!showDetailedView && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Frequency</span>
            </div>
            <p className="text-xs text-blue-700">
              Number of seizures per day (aggregated view)
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
      )}
    </div>
  )
}
