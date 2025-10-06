'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, X, AlertTriangle, Heart, Shield } from 'lucide-react'

export default function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false)

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', description: 'Call for immediate medical emergency' },
    { name: 'Epilepsy Foundation Helpline', number: '1-800-332-1000', description: '24/7 epilepsy support' },
    { name: 'National Suicide Prevention Lifeline', number: '988', description: 'Crisis support' },
    { name: 'Poison Control', number: '1-800-222-1222', description: 'Medication overdose help' },
  ]

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Phone className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-white text-red-500 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          SOS
        </span>
      </motion.button>

      {/* Emergency Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
                      <p className="text-sm text-gray-600">Quick access to help</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <motion.div
                      key={contact.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                          <p className="text-lg font-mono text-blue-600">{contact.number}</p>
                        </div>
                        <button
                          onClick={() => handleCall(contact.number)}
                          className="ml-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Heart className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Seizure First Aid</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Stay calm and time the seizure</li>
                        <li>• Protect from injury</li>
                        <li>• Turn on side if possible</li>
                        <li>• Call 911 if seizure lasts more than 5 minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Pregnancy Considerations</h4>
                      <p className="text-sm text-blue-800">
                        If you&apos;re pregnant and having a seizure, inform emergency responders immediately. 
                        They need to know about your pregnancy for proper care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
