'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  Phone,
  BookOpen,
  BarChart3,
  Users,
  Stethoscope
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import FeatureCard from '@/components/FeatureCard'
import Disclaimer from '@/components/Disclaimer'
import EmergencyButton from '@/components/EmergencyButton'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Seizure Tracking",
      description: "Log seizures with detailed information about triggers, duration, and type. Track patterns over time.",
      color: "bg-blue-500",
      href: "/tracking"
    },
    {
      icon: <Pill className="w-8 h-8" />,
      title: "Medication Safety",
      description: "Check medication safety during pregnancy. Get evidence-based information about your medications.",
      color: "bg-green-500",
      href: "/medications"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Pregnancy Milestones",
      description: "Track your pregnancy progress with trimester-specific guidance and milestone reminders.",
      color: "bg-pink-500",
      href: "/pregnancy"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Doctor Reports",
      description: "Generate comprehensive reports to share with your healthcare providers.",
      color: "bg-purple-500",
      href: "/reports"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Knowledge Base",
      description: "Access curated information about epilepsy and pregnancy from trusted medical sources.",
      color: "bg-indigo-500",
      href: "/knowledge"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Support Network",
      description: "Connect with other women facing similar challenges and access support resources.",
      color: "bg-teal-500",
      href: "/support"
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="relative">
        {/* Emergency Button - Always visible */}
        <EmergencyButton />
        
        {/* Hero Section */}
        <Hero />
        
        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need for a Safe Pregnancy
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive tools and resources designed specifically for pregnant women with epilepsy, 
                with doctors as the ultimate authority for medical decisions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety & Trust Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Safety & Trust First
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Your safety and the safety of your baby are our top priorities. 
                All information is evidence-based and regularly updated.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based</h3>
                <p className="text-gray-600">
                  All information is sourced from trusted medical institutions and peer-reviewed research.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Doctor-Centric</h3>
                <p className="text-gray-600">
                  Designed to support your relationship with healthcare providers, not replace it.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Ready</h3>
                <p className="text-gray-600">
                  Quick access to emergency information and contacts when you need them most.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <Disclaimer />
      </main>
    </div>
  )
}
