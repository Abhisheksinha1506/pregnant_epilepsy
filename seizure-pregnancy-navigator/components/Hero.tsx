import React from 'react'
import { Heart, Shield, AlertTriangle, Phone } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50"></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Trusted by Healthcare Providers</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Safe Pregnancy with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                Epilepsy
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive app designed specifically for pregnant women with epilepsy. 
              Track seizures, monitor medications, and get evidence-based guidance—all while 
              keeping your healthcare team informed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/tracking"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Tracking
            </Link>
            <Link
              href="/knowledge"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor-Centric</h3>
              <p className="text-gray-600 text-sm">
                Designed to support your relationship with healthcare providers, not replace it.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence-Based</h3>
              <p className="text-gray-600 text-sm">
                All information sourced from trusted medical institutions and peer-reviewed research.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Ready</h3>
              <p className="text-gray-600 text-sm">
                Quick access to emergency information and contacts when you need them most.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 text-red-800 mb-2">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">Emergency Information</span>
            </div>
            <p className="text-red-700 text-sm">
              If you're experiencing a medical emergency, call 911 immediately. 
              This app is for informational purposes only and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}