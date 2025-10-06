'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface GlossaryTerm {
  term: string
  definition: string
  full_form?: string
  category: string
  related_terms?: string[]
  example?: string
}

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    loadGlossaryData()
    setIsLoaded(true)
  }, [])

  const loadGlossaryData = async () => {
    try {
      const response = await fetch('/api/glossary')
      if (response.ok) {
        const data = await response.json()
        if (data.terms && Array.isArray(data.terms)) {
          setTerms(data.terms)
          setFilteredTerms(data.terms)
        }
      }
    } catch (error) {
      console.error('Error loading glossary data:', error)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    let filtered = terms

    if (term) {
      filtered = filtered.filter(t => 
        t.term.toLowerCase().includes(term.toLowerCase()) ||
        t.definition.toLowerCase().includes(term.toLowerCase()) ||
        (t.full_form && t.full_form.toLowerCase().includes(term.toLowerCase()))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    setFilteredTerms(filtered)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    let filtered = terms

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.full_form && t.full_form.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter(t => t.category === category)
    }

    setFilteredTerms(filtered)
  }

  const getCategories = () => {
    const categories = Array.from(new Set(terms.map(term => term.category)))
    return categories.sort()
  }

  const toggleExpanded = (term: string) => {
    setExpandedTerm(expandedTerm === term ? null : term)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Glossary</h1>
            <p className="text-gray-600">
              Comprehensive glossary of epilepsy and pregnancy-related medical terms.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search terms..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {getCategories().map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div className="space-y-4">
            {filteredTerms.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Terms Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredTerms.map((term, index) => (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{term.term}</h3>
                          {term.full_form && (
                            <span className="text-sm text-gray-500">({term.full_form})</span>
                          )}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {term.category}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{term.definition}</p>
                        
                        {term.related_terms && term.related_terms.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-1">Related terms:</p>
                            <div className="flex flex-wrap gap-2">
                              {term.related_terms.map(related => (
                                <span
                                  key={related}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {related}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {term.example && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Example:</p>
                            <p className="text-sm text-gray-800 italic">&ldquo;{term.example}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
