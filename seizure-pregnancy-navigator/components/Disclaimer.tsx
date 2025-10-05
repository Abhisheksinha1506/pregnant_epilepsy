'use client'

import { AlertTriangle, Shield, Phone } from 'lucide-react'

export default function Disclaimer() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Important Medical Disclaimer
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p className="text-lg font-semibold text-red-600">
                  This app does not replace professional medical advice, diagnosis, or treatment.
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">Emergency Situations</span>
                  </div>
                  <p className="text-red-700">
                    If you are experiencing a medical emergency, call 911 immediately. 
                    Do not rely on this app for emergency medical care.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Key Points:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Always consult with your healthcare provider before making any medical decisions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Do not stop, start, or change medications without doctor approval</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>This app is for informational and tracking purposes only</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Individual medical situations may vary - always seek personalized medical advice</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Your Healthcare Team</h4>
                  <p className="text-blue-800">
                    This app is designed to support your relationship with your healthcare providers, 
                    not replace them. Share your tracking data and reports with your neurologist and OB/GYN 
                    to help them provide the best care for you and your baby.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
