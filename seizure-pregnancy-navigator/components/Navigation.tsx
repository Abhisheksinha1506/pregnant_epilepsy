'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Heart, 
  Shield, 
  Phone,
  Home,
  BarChart3,
  Pill,
  Calendar,
  BookOpen,
  Users,
  Stethoscope
} from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tracking', href: '/tracking', icon: BarChart3 },
    { name: 'Medications', href: '/medications', icon: Pill },
    { name: 'Pregnancy', href: '/pregnancy', icon: Calendar },
    { name: 'Knowledge', href: '/knowledge', icon: BookOpen },
    { name: 'Support', href: '/support', icon: Users },
    { name: 'Reports', href: '/reports', icon: Stethoscope },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Seizure Pregnancy Navigator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative mx-3 flex items-center space-x-2 rounded-md px-2 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    active ? 'text-blue-700' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
                  <span>{item.name}</span>
                  <span
                    className={`pointer-events-none absolute inset-x-2 -bottom-1 h-0.5 rounded-full transition-opacity ${
                      active ? 'bg-blue-600 opacity-100' : 'bg-blue-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* Emergency Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/emergency"
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span>Emergency</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                    pathname === item.href ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                href="/emergency"
                className="flex items-center space-x-3 bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <Phone className="w-5 h-5" />
                <span>Emergency</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
