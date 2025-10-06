'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Calendar, Clock, AlertTriangle, Activity } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface SeizureLogFormProps {
  onClose: () => void
  onSubmit: (seizure: any) => void
}

export default function SeizureLogForm({ onClose, onSubmit }: SeizureLogFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: '',
    durationMinutes: '',
    durationSeconds: '',
    severity: 1,
    triggers: [] as string[],
    notes: '',
    medicationTaken: false,
    phaseOverride: '' as '' | 'pre_pregnancy' | 'pregnancy' | 'postpartum'
  })

  const seizureTypes = [
    'Focal (Simple)',
    'Focal (Complex)',
    'Generalized Tonic-Clonic',
    'Absence',
    'Myoclonic',
    'Tonic',
    'Atonic',
    'Other'
  ]

  const triggerOptions = [
    'Stress',
    'Sleep deprivation',
    'Missed medication',
    'Hormonal changes',
    'Pregnancy-related',
    'Bright lights',
    'Loud noises',
    'Dehydration',
    'Low blood sugar',
    'Other'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.type || (!formData.durationMinutes && !formData.durationSeconds)) {
      toast.error('Please fill in all required fields')
      return
    }

    const minutes = parseFloat(formData.durationMinutes) || 0
    const seconds = parseFloat(formData.durationSeconds) || 0
    
    // Validate reasonable limits
    if (minutes > 60) {
      toast.error('Minutes cannot exceed 60. For longer seizures, use hours in the notes.')
      return
    }
    
    if (seconds > 59) {
      toast.error('Seconds cannot exceed 59')
      return
    }
    
    const totalDuration = minutes + (seconds / 60)

    if (totalDuration <= 0) {
      toast.error('Duration must be greater than 0')
      return
    }

    const seizure = {
      ...formData,
      duration: totalDuration,
      durationMinutes: minutes,
      durationSeconds: seconds,
      triggers: formData.triggers
    }

    onSubmit(seizure)
  }

  const handleTriggerChange = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }))
  }

  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    const hasRequiredFields = formData.type && (formData.durationMinutes || formData.durationSeconds)
    const hasValidDuration = (parseFloat(formData.durationMinutes) || 0) + (parseFloat(formData.durationSeconds) || 0) > 0
    return hasRequiredFields && hasValidDuration
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Log New Seizure</h2>
                <p className="text-sm text-gray-600">Help your healthcare team track your seizures</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Seizure Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4 inline mr-2" />
                Seizure Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  !formData.type ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select seizure type</option>
                {seizureTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Duration and Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Minutes</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationMinutes: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.durationMinutes && !formData.durationSeconds ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Seconds</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      step="1"
                      value={formData.durationSeconds}
                      onChange={(e) => setFormData(prev => ({ ...prev, durationSeconds: e.target.value }))}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !formData.durationMinutes && !formData.durationSeconds ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter duration in minutes (0-60) and seconds (0-59). For longer seizures, note the duration in the notes field.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Severity (1-5)
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={1}>1 - Very Mild</option>
                  <option value={2}>2 - Mild</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Severe</option>
                  <option value={5}>5 - Very Severe</option>
                </select>
              </div>
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Possible Triggers
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {triggerOptions.map(trigger => (
                  <label key={trigger} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.triggers.includes(trigger)}
                      onChange={() => handleTriggerChange(trigger)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Phase Override */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record as Phase (optional)
              </label>
              <select
                value={formData.phaseOverride}
                onChange={(e) => setFormData(prev => ({ ...prev, phaseOverride: e.target.value as any }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Auto-detect from dates</option>
                <option value="pre_pregnancy">Pre-pregnancy</option>
                <option value="pregnancy">Pregnancy</option>
                <option value="postpartum">Postpartum</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">If set, this overrides the computed phase from start/due dates.</p>
            </div>

            {/* Medication Taken */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.medicationTaken}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicationTaken: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Medication taken as prescribed
                </span>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional details about the seizure..."
              />
            </div>

            {/* Validation Status */}
            {!isFormValid() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Required Fields Missing</h4>
                    <p className="text-xs text-yellow-700 mt-1">
                      Please fill in the seizure type and duration (at least minutes or seconds) to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 ${
                  isFormValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isFormValid() ? 'Log Seizure' : 'Fill Required Fields'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
