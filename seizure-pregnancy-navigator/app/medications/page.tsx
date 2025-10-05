'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Pill, 
  AlertTriangle, 
  Shield, 
  CheckCircle,
  XCircle,
  Info,
  Filter,
  Download
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import MedicationCard from '@/components/MedicationCard'
import MedicationSearch from '@/components/MedicationSearch'
import { toast } from 'react-hot-toast'

interface Medication {
  medication: string
  brand_names: string[]
  pregnancy_category: string
  safety_profile: string
  key_points: string[]
  monitoring: string[]
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    // Load medication data from our comprehensive database
    loadMedicationData()
    setIsLoaded(true)
  }, [])

  const loadMedicationData = async () => {
    try {
      // Load medication data from our API
      const response = await fetch('/api/medications')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.medications && Array.isArray(data.medications)) {
        setMedications(data.medications)
        setFilteredMedications(data.medications)
      } else {
        // Fallback to static data if API fails
        const fallbackMedications: Medication[] = [
          {
            medication: "Lamotrigine",
            brand_names: ["Lamictal"],
            pregnancy_category: "Category C",
            safety_profile: "Generally considered safer during pregnancy",
            key_points: [
              "Lower risk of major congenital malformations compared to valproate",
              "May require dose adjustments during pregnancy",
              "Therapeutic drug monitoring recommended",
              "Considered safe for breastfeeding"
            ],
            monitoring: [
              "Regular blood level monitoring",
              "Folic acid supplementation (5mg daily)",
              "Detailed anomaly scan at 18-20 weeks"
            ]
          },
          {
            medication: "Levetiracetam",
            brand_names: ["Keppra"],
            pregnancy_category: "Category C",
            safety_profile: "Generally considered safer during pregnancy",
            key_points: [
              "Lower risk of major congenital malformations",
              "Good seizure control during pregnancy",
              "May require dose adjustments",
              "Considered safe for breastfeeding"
            ],
            monitoring: [
              "Regular blood level monitoring",
              "Folic acid supplementation (5mg daily)",
              "Detailed anomaly scan at 18-20 weeks"
            ]
          },
          {
            medication: "Valproic Acid",
            brand_names: ["Depakote", "Depakene"],
            pregnancy_category: "Category D",
            safety_profile: "Higher risk during pregnancy",
            key_points: [
              "Highest risk of major congenital malformations (10-11%)",
              "Increased risk of neurodevelopmental problems",
              "Should be avoided if possible during pregnancy",
              "If necessary, use lowest effective dose"
            ],
            monitoring: [
              "High-dose folic acid supplementation (5mg daily)",
              "Detailed anomaly scan at 18-20 weeks",
              "Consider alternative medications if possible",
              "Close monitoring for birth defects"
            ]
          },
          {
            medication: "Carbamazepine",
            brand_names: ["Tegretol"],
            pregnancy_category: "Category D",
            safety_profile: "Moderate risk during pregnancy",
            key_points: [
              "Risk of neural tube defects",
              "May cause vitamin K deficiency in newborn",
              "Requires folic acid supplementation",
              "Consider vitamin K supplementation in last month"
            ],
            monitoring: [
              "Folic acid supplementation (5mg daily)",
              "Detailed anomaly scan at 18-20 weeks",
              "Vitamin K supplementation in last month",
              "Monitor for neural tube defects"
            ]
          },
          {
            medication: "Phenytoin",
            brand_names: ["Dilantin"],
            pregnancy_category: "Category D",
            safety_profile: "Moderate risk during pregnancy",
            key_points: [
              "Risk of fetal hydantoin syndrome",
              "May cause vitamin K deficiency",
              "Requires careful monitoring",
              "Consider alternative medications"
            ],
            monitoring: [
              "Folic acid supplementation (5mg daily)",
              "Detailed anomaly scan at 18-20 weeks",
              "Vitamin K supplementation in last month",
              "Monitor for fetal hydantoin syndrome"
            ]
          }
        ]
        
        setMedications(fallbackMedications)
        setFilteredMedications(fallbackMedications)
      }
    } catch (error) {
      console.error('Error loading medication data:', error)
      toast.error('Failed to load medication data')
      
      // Fallback to static data on error
      const fallbackMedications: Medication[] = [
        {
          medication: "Lamotrigine",
          brand_names: ["Lamictal"],
          pregnancy_category: "Category C",
          safety_profile: "Generally considered safer during pregnancy",
          key_points: [
            "Lower risk of major congenital malformations compared to valproate",
            "May require dose adjustments during pregnancy",
            "Therapeutic drug monitoring recommended",
            "Considered safe for breastfeeding"
          ],
          monitoring: [
            "Regular blood level monitoring",
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks"
          ]
        },
        {
          medication: "Levetiracetam",
          brand_names: ["Keppra"],
          pregnancy_category: "Category C",
          safety_profile: "Generally considered safer during pregnancy",
          key_points: [
            "Lower risk of major congenital malformations",
            "Good seizure control during pregnancy",
            "May require dose adjustments",
            "Considered safe for breastfeeding"
          ],
          monitoring: [
            "Regular blood level monitoring",
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks"
          ]
        },
        {
          medication: "Valproic Acid",
          brand_names: ["Depakote", "Depakene"],
          pregnancy_category: "Category D",
          safety_profile: "Higher risk during pregnancy",
          key_points: [
            "Highest risk of major congenital malformations (10-11%)",
            "Increased risk of neurodevelopmental problems",
            "Should be avoided if possible during pregnancy",
            "If necessary, use lowest effective dose"
          ],
          monitoring: [
            "High-dose folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks",
            "Consider alternative medications if possible",
            "Close monitoring for birth defects"
          ]
        },
        {
          medication: "Carbamazepine",
          brand_names: ["Tegretol"],
          pregnancy_category: "Category D",
          safety_profile: "Moderate risk during pregnancy",
          key_points: [
            "Risk of neural tube defects",
            "May cause vitamin K deficiency in newborn",
            "Requires folic acid supplementation",
            "Consider vitamin K supplementation in last month"
          ],
          monitoring: [
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks",
            "Vitamin K supplementation in last month",
            "Monitor for neural tube defects"
          ]
        },
        {
          medication: "Phenytoin",
          brand_names: ["Dilantin"],
          pregnancy_category: "Category D",
          safety_profile: "Moderate risk during pregnancy",
          key_points: [
            "Risk of fetal hydantoin syndrome",
            "May cause vitamin K deficiency",
            "Requires careful monitoring",
            "Consider alternative medications"
          ],
          monitoring: [
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks",
            "Vitamin K supplementation in last month",
            "Monitor for fetal hydantoin syndrome"
          ]
        }
      ]
      
      setMedications(fallbackMedications)
      setFilteredMedications(fallbackMedications)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = medications.filter(med => 
      med.medication.toLowerCase().includes(term.toLowerCase()) ||
      med.brand_names.some(brand => brand.toLowerCase().includes(term.toLowerCase()))
    )
    setFilteredMedications(filtered)
  }

  const handleFilter = (filterType: string) => {
    setFilter(filterType)
    let filtered = medications

    if (filterType === 'safer') {
      filtered = medications.filter(med => 
        med.safety_profile.includes('safer') || 
        med.pregnancy_category === 'Category C'
      )
    } else if (filterType === 'high-risk') {
      filtered = medications.filter(med => 
        med.pregnancy_category === 'Category D' ||
        med.safety_profile.includes('risk')
      )
    } else if (filterType === 'category-c') {
      filtered = medications.filter(med => med.pregnancy_category === 'Category C')
    } else if (filterType === 'category-d') {
      filtered = medications.filter(med => med.pregnancy_category === 'Category D')
    }

    if (searchTerm) {
      filtered = filtered.filter(med => 
        med.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.brand_names.some(brand => brand.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredMedications(filtered)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Category A':
        return 'text-green-600 bg-green-100'
      case 'Category B':
        return 'text-blue-600 bg-blue-100'
      case 'Category C':
        return 'text-yellow-600 bg-yellow-100'
      case 'Category D':
        return 'text-orange-600 bg-orange-100'
      case 'Category X':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getSafetyIcon = (safety: string) => {
    if (safety.includes('safer')) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (safety.includes('risk')) return <AlertTriangle className="w-5 h-5 text-red-600" />
    return <Info className="w-5 h-5 text-blue-600" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Safety</h1>
            <p className="text-gray-600">
              Check the safety of epilepsy medications during pregnancy. Always consult your doctor before making any changes.
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
                    placeholder="Search medications..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilter('safer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'safer'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Safer Options
                </button>
                <button
                  onClick={() => handleFilter('high-risk')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'high-risk'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  High Risk
                </button>
                <button
                  onClick={() => handleFilter('category-c')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'category-c'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Category C
                </button>
                <button
                  onClick={() => handleFilter('category-d')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'category-d'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Category D
                </button>
              </div>
            </div>
          </div>

          {/* Pregnancy Categories Legend */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pregnancy Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded text-xs font-medium text-green-600 bg-green-100">Category A</span>
                <span className="text-sm text-gray-600">Safest - No risk to fetus</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded text-xs font-medium text-blue-600 bg-blue-100">Category B</span>
                <span className="text-sm text-gray-600">Low risk - Animal studies safe</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded text-xs font-medium text-yellow-600 bg-yellow-100">Category C</span>
                <span className="text-sm text-gray-600">Moderate risk - Use with caution</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded text-xs font-medium text-orange-600 bg-orange-100">Category D</span>
                <span className="text-sm text-gray-600">High risk - Use only if necessary</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2 py-1 rounded text-xs font-medium text-red-600 bg-red-100">Category X</span>
                <span className="text-sm text-gray-600">Contraindicated - Do not use</span>
              </div>
            </div>
          </div>

          {/* Medications List */}
          <div className="space-y-6">
            {filteredMedications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medications Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredMedications.map((medication, index) => (
                <motion.div
                  key={medication.medication}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <MedicationCard medication={medication} />
                </motion.div>
              ))
            )}
          </div>

          {/* Important Notice */}
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Important Medical Notice</h3>
                <p className="text-red-800 mb-4">
                  This information is for educational purposes only. Always consult your healthcare provider 
                  before making any changes to your medications. Individual medical situations may vary.
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Do not stop, start, or change medications without doctor approval</li>
                  <li>• This information is not a substitute for professional medical advice</li>
                  <li>• Always discuss medication changes with your neurologist and OB/GYN</li>
                  <li>• Emergency situations require immediate medical attention</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
