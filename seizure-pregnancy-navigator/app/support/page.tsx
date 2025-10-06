'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  Heart,
  Shield,
  AlertTriangle
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface SupportResource {
  id: string
  title: string
  description: string
  type: 'contact' | 'resource' | 'guide' | 'community'
  contact?: string
  url?: string
  available: string
  icon: string
}

const supportResources: SupportResource[] = [
  {
    id: '1',
    title: 'Epilepsy Foundation 24/7 Helpline',
    description: 'Trained information specialists available 24/7 to answer questions about epilepsy and seizures.',
    type: 'contact',
    contact: '1-800-332-1000',
    available: '24/7',
    icon: 'phone'
  },
  {
    id: '2',
    title: 'Epilepsy Foundation Spanish Helpline',
    description: 'Spanish-speaking specialists available for support and information.',
    type: 'contact',
    contact: '1-866-748-8008',
    available: '24/7',
    icon: 'phone'
  },
  {
    id: '3',
    title: 'MotherToBaby Information Service',
    description: 'Expert information about medications and exposures during pregnancy and breastfeeding.',
    type: 'contact',
    contact: '1-866-626-6847',
    available: 'Mon-Fri 8am-5pm PST',
    icon: 'phone'
  },
  {
    id: '4',
    title: 'Epilepsy Alliance America – Support Groups',
    description: 'Find local and virtual support groups and community programs.',
    type: 'community',
    url: 'https://www.epilepsyallianceamerica.org/programs-services/',
    available: 'Online',
    icon: 'users'
  },
  {
    id: '5',
    title: 'CDC Seizure First Aid',
    description: 'Official guidance on seizure first aid from the CDC.',
    type: 'guide',
    url: 'https://www.cdc.gov/epilepsy/about/first-aid.htm',
    available: 'Online',
    icon: 'book'
  },
  {
    id: '6',
    title: 'Pregnancy Registry Support',
    description: 'Join pregnancy registries to help advance epilepsy research.',
    type: 'resource',
    url: 'https://www.aedpregnancyregistry.org/',
    available: 'Online',
    icon: 'heart'
  }
]

export default function SupportPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'phone': return <Phone className="w-6 h-6" />
      case 'users': return <Users className="w-6 h-6" />
      case 'book': return <BookOpen className="w-6 h-6" />
      case 'heart': return <Heart className="w-6 h-6" />
      default: return <HelpCircle className="w-6 h-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resource': return 'bg-green-100 text-green-700 border-green-200'
      case 'guide': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'community': return 'bg-pink-100 text-pink-700 border-pink-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
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
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Support & Resources</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the help and support you need for your epilepsy and pregnancy journey.
            </p>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Medical Emergency?</h3>
                <p className="text-red-800 mb-3">
                  If you&apos;re experiencing a medical emergency, call 911 immediately. 
                  This support page is for informational purposes only.
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-red-700 font-medium">Emergency: 911</span>
                  <span className="text-red-700">|</span>
                  <span className="text-red-700">Poison Control: 1-800-222-1222</span>
                </div>
              </div>
            </div>
          </div>

          {/* Support Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {supportResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
                      {getIcon(resource.icon)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-xs mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{resource.available}</span>
                  </div>
                  
                  {resource.contact && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{resource.contact}</span>
                      </div>
                    </div>
                  )}
                  
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Visit Resource <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Providers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <span>Neurologist (Epilepsy Specialist)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <span>Obstetrician-Gynecologist (OB-GYN)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <span>Maternal-Fetal Medicine Specialist</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                    <span>Genetic Counselor</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Documents</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Seizure Action Plan</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Medication List</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Emergency Contacts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-green-600" />
                    <span>Pregnancy Care Plan</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Disclaimer</h3>
                <p className="text-blue-800">
                  The information and resources provided on this page are for educational purposes only and should not be considered medical advice. 
                  Always consult with your healthcare provider for any health concerns or before making any decisions related to your health or treatment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
