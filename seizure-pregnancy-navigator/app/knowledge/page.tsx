'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  ExternalLink,
  FileText,
  Video,
  Users,
  Calendar,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Tag,
  SortAsc
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface KnowledgeItem {
  id: string
  title: string
  type: 'article' | 'video' | 'guide' | 'research' | 'support'
  category: string
  description: string
  source: string
  url?: string
  date?: string
  readingTime?: string
  tags: string[]
  raw?: string
  tableSample?: any[]
  columns?: string[]
}

interface GlossaryTerm {
  term: string
  definition: string
  full_form?: string
  category: string
  related_terms: string[]
  example: string
}

export default function KnowledgePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoaded, setIsLoaded] = useState(false)
  // Removed raw view toggle per UX request
  const [expandedId] = useState<string | null>(null)
  const [rowsOpen, setRowsOpen] = useState<Record<string, boolean>>({})
  
  // Glossary state
  const [activeTab, setActiveTab] = useState<'knowledge' | 'glossary'>('knowledge')
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([])
  const [glossarySearchTerm, setGlossarySearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLetter, setSelectedLetter] = useState('all')
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const res = await fetch('/api/knowledge')
        if (res.ok) {
          const data = await res.json()
          if (data.items && Array.isArray(data.items)) {
            const cleaned = data.items.filter((it: any) => it.source !== 'Markdown File')
            setKnowledgeItems(cleaned)
            setFilteredItems(cleaned)
            setIsLoaded(true)
            return
          }
        }
        // Fallback to local static data if API fails or returns empty
        loadKnowledgeData()
        setIsLoaded(true)
      } catch (_err) {
        loadKnowledgeData()
        setIsLoaded(true)
      }
    }
    fetchKnowledge()
    loadGlossaryData()
  }, [])

  const loadKnowledgeData = () => {
    const knowledgeData: KnowledgeItem[] = [
      {
        id: '1',
        title: 'Epilepsy and Pregnancy: A Comprehensive Guide',
        type: 'guide',
        category: 'Pregnancy Safety',
        description: 'Complete guide to managing epilepsy during pregnancy, including medication safety and monitoring requirements.',
        source: 'Epilepsy Foundation',
        url: 'https://www.epilepsy.com/living-epilepsy/women-and-epilepsy/pregnancy',
        date: '2024-01-15',
        readingTime: '15 min',
        tags: ['pregnancy', 'safety', 'medications', 'monitoring']
      },
      {
        id: '2',
        title: 'Antiepileptic Drugs and Birth Defects',
        type: 'research',
        category: 'Research',
        description: 'Latest research findings on the relationship between antiepileptic drugs and birth defects.',
        source: 'New England Journal of Medicine',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa0701617',
        date: '2024-02-20',
        readingTime: '20 min',
        tags: ['research', 'birth-defects', 'medications', 'safety']
      },
      {
        id: '3',
        title: 'Seizure Management During Pregnancy',
        type: 'video',
        category: 'Education',
        description: 'Educational video series on managing seizures during pregnancy with expert neurologist Dr. Sarah Johnson.',
        source: 'Epilepsy Society',
        url: 'https://www.epilepsysociety.org.uk/pregnancy-and-epilepsy',
        date: '2024-01-10',
        readingTime: '25 min',
        tags: ['seizures', 'pregnancy', 'management', 'education']
      },
      {
        id: '4',
        title: 'Folic Acid Supplementation for Women with Epilepsy',
        type: 'article',
        category: 'Nutrition',
        description: 'Importance of folic acid supplementation before and during pregnancy for women with epilepsy.',
        source: 'American College of Obstetricians and Gynecologists',
        url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2013/01/neural-tube-defects',
        date: '2024-03-05',
        readingTime: '8 min',
        tags: ['folic-acid', 'supplementation', 'pregnancy', 'nutrition']
      },
      {
        id: '5',
        title: 'Pregnancy Registry for Antiepileptic Drugs',
        type: 'support',
        category: 'Support',
        description: 'Information about participating in pregnancy registries to help advance research on epilepsy medications.',
        source: 'North American Antiepileptic Drug Pregnancy Registry',
        url: 'https://www.aedpregnancyregistry.org/',
        date: '2024-02-15',
        readingTime: '10 min',
        tags: ['registry', 'research', 'participation', 'support']
      },
      {
        id: '6',
        title: 'Breastfeeding with Epilepsy Medications',
        type: 'guide',
        category: 'Breastfeeding',
        description: 'Comprehensive guide to breastfeeding while taking antiepileptic medications.',
        source: 'LactMed Database',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK501922/',
        date: '2024-01-25',
        readingTime: '12 min',
        tags: ['breastfeeding', 'medications', 'safety', 'lactation']
      },
      {
        id: '7',
        title: 'Emergency Seizure Management During Pregnancy',
        type: 'video',
        category: 'Emergency',
        description: 'Step-by-step video guide for managing seizures during pregnancy emergencies.',
        source: 'Epilepsy Foundation',
        url: 'https://www.epilepsy.com/living-epilepsy/first-aid',
        date: '2024-02-28',
        readingTime: '18 min',
        tags: ['emergency', 'seizures', 'pregnancy', 'first-aid']
      },
      {
        id: '8',
        title: 'Epilepsy and Mental Health',
        type: 'article',
        category: 'Mental Health',
        description: 'Understanding mental wellbeing with epilepsy and where to get support.',
        source: 'Epilepsy Society (UK)',
        url: 'https://epilepsysociety.org.uk/epilepsy-and-mental-health',
        date: '2024-03-10',
        readingTime: '10 min',
        tags: ['mental-health', 'wellbeing', 'support']
      }
    ]

    setKnowledgeItems(knowledgeData)
    setFilteredItems(knowledgeData)
  }

  const loadGlossaryData = async () => {
    try {
      // Try to load from the comprehensive database first
      const response = await fetch('/api/glossary')
      if (response.ok) {
        const data = await response.json()
        if (data.terms && Array.isArray(data.terms)) {
          setGlossaryTerms(data.terms)
          setFilteredTerms(data.terms)
          return
        }
      }
    } catch (error) {
      console.error('Error loading glossary from API:', error)
    }
    
    // Fallback to static data if API fails
    const fallbackData: GlossaryTerm[] = [
      {
        term: "AED",
        definition: "Anti-Epileptic Drug. Medications used to treat epilepsy and prevent seizures.",
        full_form: "Anti-Epileptic Drug",
        category: "Medications & Pharmacology",
        related_terms: ["ASM", "anticonvulsant", "seizure medication"],
        example: "Common AEDs include lamotrigine, levetiracetam, and valproic acid."
      },
      {
        term: "ASM",
        definition: "Anti-Seizure Medication. Another term for anti-epileptic drugs used to control seizures.",
        full_form: "Anti-Seizure Medication",
        category: "Medications & Pharmacology",
        related_terms: ["AED", "anticonvulsant", "seizure medication"],
        example: "ASMs are carefully monitored during pregnancy for safety."
      },
      {
        term: "Teratogenicity",
        definition: "The ability of a substance to cause birth defects or developmental abnormalities in a developing fetus.",
        category: "Medications & Pharmacology",
        related_terms: ["birth defects", "developmental toxicity", "fetal risk"],
        example: "The teratogenicity of AEDs varies significantly between different medications."
      },
      {
        term: "MFM",
        definition: "Maternal-Fetal Medicine. A medical specialty that focuses on high-risk pregnancies and complex maternal and fetal conditions.",
        full_form: "Maternal-Fetal Medicine",
        category: "Healthcare Providers",
        related_terms: ["perinatologist", "high-risk pregnancy", "fetal medicine"],
        example: "Women with epilepsy may be referred to an MFM specialist during pregnancy."
      },
      {
        term: "Polytherapy",
        definition: "The use of multiple anti-epileptic drugs simultaneously to control seizures.",
        category: "Medications & Pharmacology",
        related_terms: ["combination therapy", "multiple AEDs", "drug interactions"],
        example: "Polytherapy during pregnancy increases the complexity of medication management."
      }
    ]
    
    setGlossaryTerms(fallbackData)
    setFilteredTerms(fallbackData)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = knowledgeItems.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
    )
    setFilteredItems(filtered)
  }

  const handleFilter = (filterType: string) => {
    setFilter(filterType)
    let filtered = knowledgeItems

    if (filterType !== 'all') {
      filtered = knowledgeItems.filter(item => item.type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredItems(filtered)
  }

  // Glossary functions
  const handleGlossarySearch = (term: string) => {
    setGlossarySearchTerm(term)
    filterGlossaryTerms(term, selectedCategory, selectedLetter)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterGlossaryTerms(glossarySearchTerm, category, selectedLetter)
  }

  const handleLetterFilter = (letter: string) => {
    setSelectedLetter(letter)
    filterGlossaryTerms(glossarySearchTerm, selectedCategory, letter)
  }

  const filterGlossaryTerms = (search: string, category: string, letter: string) => {
    let filtered = glossaryTerms

    // Search filter
    if (search) {
      filtered = filtered.filter(term => 
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase()) ||
        term.related_terms.some(related => 
          related.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(term => term.category === category)
    }

    // Letter filter
    if (letter !== 'all') {
      filtered = filtered.filter(term => 
        term.term.toLowerCase().startsWith(letter.toLowerCase())
      )
    }

    setFilteredTerms(filtered)
  }

  const toggleExpanded = (term: string) => {
    setExpandedTerm(expandedTerm === term ? null : term)
  }

  const getCategories = () => {
    const categories = Array.from(new Set(glossaryTerms.map(term => term.category)))
    return categories.sort()
  }

  const getLetters = () => {
    const letters = Array.from(new Set(glossaryTerms.map(term => term.term.charAt(0).toUpperCase())))
    return letters.sort()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-5 h-5 text-blue-600" />
      case 'video':
        return <Video className="w-5 h-5 text-red-600" />
      case 'guide':
        return <BookOpen className="w-5 h-5 text-green-600" />
      case 'research':
        return <Users className="w-5 h-5 text-purple-600" />
      case 'support':
        return <Heart className="w-5 h-5 text-pink-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800'
      case 'video':
        return 'bg-red-100 text-red-800'
      case 'guide':
        return 'bg-green-100 text-green-800'
      case 'research':
        return 'bg-purple-100 text-purple-800'
      case 'support':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const humanizeForCsv = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value)
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return ''
      // Array of primitives
      if (value.every(v => typeof v !== 'object' || v === null)) {
        return value.map(v => String(v)).join(' | ')
      }
      // Array of objects - pick meaningful fields
      return value.map((obj) => {
        if (!obj || typeof obj !== 'object') return ''
        // Prefer common fields
        if ('topic' in obj && ('content' in obj)) {
          const topic = String((obj as any).topic)
          const content = Array.isArray((obj as any).content) ? (obj as any).content.join(' ') : String((obj as any).content ?? '')
          return `${topic}: ${content}`
        }
        if ('medication' in obj && ('breastfeeding_safety' in obj)) {
          return `${(obj as any).medication}: ${(obj as any).breastfeeding_safety}`
        }
        // Generic compact key=value pairs (first few)
        const entries = Object.entries(obj as Record<string, any>)
          .filter(([k]) => k !== 'extraction_info' && k !== 'sections')
          .slice(0, 3)
          .map(([k, v]) => `${k}: ${typeof v === 'object' ? humanizeForCsv(v) : String(v)}`)
        return entries.join('; ')
      }).join(' | ')
    }
    // Plain object
    const entries = Object.entries(value as Record<string, any>)
      .filter(([k]) => k !== 'extraction_info' && k !== 'sections')
      .slice(0, 5)
      .map(([k, v]) => `${k}: ${Array.isArray(v) || typeof v === 'object' ? humanizeForCsv(v) : String(v)}`)
    return entries.join('; ')
  }

  const toCSV = (rows: any[], columns?: string[]) => {
    if (!rows || rows.length === 0) return ''
    const cols = (columns && columns.length > 0
      ? columns
      : Array.from(rows.reduce((set: Set<string>, row: any) => {
          if (row && typeof row === 'object') {
            Object.keys(row).forEach(k => set.add(k))
          }
          return set
        }, new Set<string>())))
      .filter((c) => {
        const norm = c.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (norm === 'extractedat') return false
        if (norm === 'date' || norm === 'time') return false
        return c !== 'extraction_info' && c !== 'sections'
      })

    const escape = (val: any) => {
      const s = humanizeForCsv(val)
      const needsQuotes = /[",\n]/.test(s)
      return needsQuotes ? '"' + s.replace(/"/g, '""') + '"' : s
    }

    const header = cols.join(',')
    const lines = rows.map(row => cols.map(col => escape(row ? row[col] : '')).join(','))
    return [header, ...lines].join('\n')
  }

  const downloadCSV = (item: KnowledgeItem) => {
    if (!item.tableSample || item.tableSample.length === 0) return
    const csv = toCSV(item.tableSample, item.columns)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${item.id}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Raw copy removed per UX request

  const toTitleCase = (key: string) => {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^\w|\s\w/g, (m) => m.toUpperCase())
  }

  const getDescriptionFromRaw = (item: KnowledgeItem): string => {
    if (!item) return ''
    const raw = item.raw
    if (typeof raw === 'string' && raw.trim().length > 0) {
      try {
        const data = JSON.parse(raw)
        // Priority 1: explicit description
        if (typeof data.description === 'string' && data.description.trim().length > 0) {
          return data.description
        }
        // Priority 2: sections[].content or sections[].title
        if (Array.isArray(data.sections)) {
          const parts: string[] = []
          for (const sec of data.sections) {
            if (sec && typeof sec === 'object') {
              if (typeof sec.title === 'string') parts.push(sec.title)
              if (Array.isArray(sec.content)) parts.push(sec.content.join(' '))
            }
            if (parts.length > 0) break
          }
          if (parts.length > 0) return parts.join(' ')
        }
        // Priority 3: sources[].description or sources[].content
        if (Array.isArray(data.sources)) {
          for (const s of data.sources) {
            if (!s) continue
            if (typeof s.description === 'string' && s.description.trim().length > 0) return s.description
            if (Array.isArray(s.content) && s.content.length > 0) return s.content.join(' ')
          }
        }
        // Priority 4: domain-specific arrays (first meaningful field)
        const tryArrays = ['lactation_guidelines', 'epilepsy_medications_breastfeeding', 'pregnancy_categories', 'epilepsy_pregnancy_info', 'pregnancy_registry_info', 'drug_safety_info']
        for (const key of tryArrays) {
          const v = (data as any)[key]
          if (Array.isArray(v) && v.length > 0) {
            const first = v[0]
            if (first) {
              if (typeof first.description === 'string') return first.description
              if (typeof first.title === 'string') return first.title
              if (Array.isArray(first.content) && first.content.length > 0) return first.content.join(' ')
            }
          }
        }
        // Fallback: first non-trivial string in object
        const gatherStrings = (obj: any, acc: string[] = []): string[] => {
          if (!obj || typeof obj !== 'object') return acc
          for (const [k, v] of Object.entries(obj)) {
            if (k === 'extraction_info' || k === 'sections') continue
            if (typeof v === 'string' && v.trim().length > 20) {
              acc.push(v)
              if (acc.length > 0) break
            } else if (Array.isArray(v)) {
              for (const el of v) {
                if (typeof el === 'string' && el.trim().length > 20) { acc.push(el); break }
                if (el && typeof el === 'object') gatherStrings(el, acc)
                if (acc.length > 0) break
              }
            } else if (v && typeof v === 'object') {
              gatherStrings(v, acc)
            }
            if (acc.length > 0) break
          }
          return acc
        }
        const strings = gatherStrings(data)
        if (strings.length > 0) return strings[0]
      } catch (_e) {
        // raw was not JSON; fall through
        return raw
      }
    }
    // Final fallback to provided description
    return item.description || ''
  }

  const renderCellValue = (value: any, max = 120) => {
    if (value === null || value === undefined) return ''
    let text: string
    if (Array.isArray(value)) {
      text = humanizeForCsv(value)
    } else if (typeof value === 'object') {
      text = humanizeForCsv(value)
    } else {
      text = String(value)
    }
    // Strip common date/time patterns
    text = text
      .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
      .replace(/\b\d{4}[\/\.]\d{2}[\/\.]\d{2}\b/g, '')
      .replace(/\b\d{1,2}[:\.]\d{2}(?::\d{2})?\b/g, '')
      .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*\d{4}\b/gi, '')
      .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},\s*\d{4}\b/gi, '')
    const pretty = text.replace(/\n/g, ' ')
    if (pretty.length <= max) return pretty
    return pretty.slice(0, max) + '…'
  }

  const getTitleAttr = (col: string, value: any, max = 120): string | undefined => {
    if (col === 'sources') return undefined
    if (value === null || value === undefined) return undefined
    if (typeof value === 'object') return undefined
    const text = String(value)
    return text.length > max ? text : undefined
  }

  const cleanDescription = (text?: string) => {
    if (!text) return ''
    const stripDates = (s: string) => s
      .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '')
      .replace(/\b\d{4}[\/\.]\d{2}[\/\.]\d{2}\b/g, '')
      .replace(/\b\d{1,2}[:\.]\d{2}(?::\d{2})?\b/g, '')
      .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s*\d{4}\b/gi, '')
      .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},\s*\d{4}\b/gi, '')
    return stripDates(text)
      .replace(/^#+\s*/g, '') // strip leading markdown headers
      .replace(/\bDownload:\b/gi, '') // remove noisy prefixes
      .replace(/\s{2,}/g, ' ')
      .trim()
  }

  const findPdfUrlInTable = (item: KnowledgeItem): string | null => {
    if (!item.tableSample || item.tableSample.length === 0) return null
    const first = item.tableSample[0]
    const values: string[] = Object.values(first || {})
      .map((v: any) => (typeof v === 'string' ? v : JSON.stringify(v)))
    const match = values.find(v => /https?:\/\/[^\s"']+\.pdf(\b|$)/i.test(v))
    if (match) {
      const m = match.match(/https?:\/\/[^\s"']+\.pdf(\b|$)/i)
      return m ? m[0] : null
    }
    return null
  }

  type PrimaryAction = { type: 'pdf' | 'csv' | 'website'; label: string; url?: string; onClick?: () => void }

  const getPrimaryAction = (item: KnowledgeItem): PrimaryAction | null => {
    const itemUrl = item.url && /^https?:\/\//.test(item.url) ? item.url : undefined
    const pdfFromItem = itemUrl && /\.pdf(\b|$)/i.test(itemUrl) ? itemUrl : undefined
    const pdfFromTable = findPdfUrlInTable(item) || undefined

    if (pdfFromItem || pdfFromTable) {
      return { type: 'pdf', label: 'PDF', url: pdfFromItem || pdfFromTable }
    }

    if (item.tableSample && item.tableSample.length > 0 && item.type !== 'article' && item.type !== 'guide') {
      return { type: 'csv', label: 'CSV', onClick: () => downloadCSV(item) }
    }

    if (itemUrl) {
      return { type: 'website', label: 'Website', url: itemUrl }
    }

    return null
  }

  const humanizeSources = (value: any) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {value.slice(0, 5).map((s: any, i: number) => {
            const title = s.title || ''
            const url = s.url
            const desc = s.description || (Array.isArray(s.content) ? s.content[0] : '')
            return (
              <li key={i} className="break-words">
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {title ? title : 'Website'}
                  </a>
                ) : (title ? (
                  <span className="font-medium text-gray-800">{title}</span>
                ) : null)}
                {desc ? <span className="text-gray-600"> — {renderCellValue(desc, 140)}</span> : null}
              </li>
            )
          })}
          {value.length > 5 && (
            <li className="text-xs text-gray-500">and {value.length - 5} more…</li>
          )}
        </ul>
      )
    }
    return renderCellValue(value)
  }

  const humanizeUrl = (value: any) => {
    if (typeof value !== 'string') return renderCellValue(value)
    try {
      const u = new URL(value)
      const host = u.hostname.replace(/^www\./i, '')
      const root = host.split('.')[0]
      const label = root.length <= 4 ? root.toUpperCase() : root.replace(/^\w|\s\w/g, (m) => m.toUpperCase())
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          {label} Website
        </a>
      )
    } catch (_e) {
      return renderCellValue(value)
    }
  }

  const getDisplayColumns = (item: KnowledgeItem): string[] => {
    const cols = (item.columns && item.columns.length > 0
      ? item.columns
      : Object.keys(item.tableSample?.[0] || {}))
      .filter((col) => {
        const norm = col.toLowerCase().replace(/[^a-z0-9]/g, '')
        if (norm === 'extractedat') return false
        if (norm === 'date' || norm === 'time') return false
        if (norm === 'source') return false
        return col !== 'extraction_info' && col !== 'sections'
      })
    return cols
  }

  // --- Aggregation helpers for redesign ---
  type LinkItem = { url: string; label: string; description?: string }

  const toDomainLabel = (url: string): string => {
    try {
      const u = new URL(url)
      const host = u.hostname.replace(/^www\./i, '')
      const root = host.split('.')[0]
      return root.length <= 4 ? root.toUpperCase() : root.replace(/(^|\s)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase())
    } catch {
      return 'Website'
    }
  }

  const normalizeUrl = (raw: string): string => {
    try {
      // Trim and strip surrounding punctuation
      const cleaned = raw.trim().replace(/[),.;]+$/g, '')
      const u = new URL(cleaned)
      u.hash = ''
      // Remove common tracking params
      const paramsToDrop = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'])
      paramsToDrop.forEach((p) => u.searchParams.delete(p))
      // Lowercase host, remove default ports, remove trailing slash
      const host = u.hostname.toLowerCase()
      const proto = u.protocol
      const port = (u.port && !((proto === 'https:' && u.port === '443') || (proto === 'http:' && u.port === '80'))) ? ':' + u.port : ''
      let path = u.pathname
      if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
      const search = u.search
      return `${proto}//${host}${port}${path}${search}`
    } catch {
      return raw.trim()
    }
  }

  const extractUrlsFromObject = (obj: any, out: Set<string>) => {
    if (!obj) return
    if (typeof obj === 'string') {
      const matches = obj.match(/https?:\/\/[^\s"'<>]+/g)
      if (matches) matches.forEach((m) => out.add(m))
      return
    }
    if (Array.isArray(obj)) {
      obj.forEach((v) => extractUrlsFromObject(v, out))
      return
    }
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        if (k === 'extraction_info') continue
        extractUrlsFromObject(v, out)
      }
    }
  }

  const extractLinksFromItem = (item: KnowledgeItem): { pdfs: LinkItem[]; links: LinkItem[] } => {
    const urls = new Set<string>()
    if (item.url && /^https?:\/\//.test(item.url)) urls.add(normalizeUrl(item.url))
    if (item.raw) {
      try {
        const json = JSON.parse(item.raw)
        extractUrlsFromObject(json, urls)
      } catch {
        extractUrlsFromObject(item.raw, urls)
      }
    }
    if (item.tableSample && item.tableSample.length > 0) {
      extractUrlsFromObject(item.tableSample[0], urls)
    }
    const all = Array.from(urls)
    const pdfs: LinkItem[] = []
    const links: LinkItem[] = []
    all.forEach((u) => {
      const isPdf = /\.pdf(\b|$)/i.test(u)
      const label = isPdf ? 'PDF' : `${toDomainLabel(u)} Website`
      ;(isPdf ? pdfs : links).push({ url: u, label })
    })
    return { pdfs, links }
  }

  const aggregated = useMemo(() => {
    // Curated PDFs
    const pdfs: LinkItem[] = [
      { url: 'https://doclibrary-rcht.cornwall.nhs.uk/DocumentsLibrary/RoyalCornwallHospitalsTrust/Clinical/MidwiferyAndObstetrics/EpilepsyInPregnancyClinicalGuideline.pdf', label: 'Royal Cornwall Hospitals – Epilepsy in Pregnancy Clinical Guideline' },
      { url: 'https://mothertobaby.org/fact-sheets/lamotrigine/pdf/', label: 'MotherToBaby – Lamotrigine Fact Sheet' },
      { url: 'https://mothertobaby.org/fact-sheets/oxcarbazepine/pdf/', label: 'MotherToBaby – Oxcarbazepine Fact Sheet' },
      { url: 'https://mothertobaby.org/fact-sheets/gabapentin/pdf/', label: 'MotherToBaby – Gabapentin Fact Sheet' },
      { url: 'https://mothertobaby.org/fact-sheets/topiramate/pdf/', label: 'MotherToBaby – Topiramate Fact Sheet' },
      { url: 'https://www.briviact.com/seizure-diary.pdf', label: 'Briviact – Seizure Diary' }
    ]

    // Curated Helpful Links (with descriptions)
    let links: LinkItem[] = [
      { url: 'https://www.nice.org.uk/guidance/cg137', label: 'NICE – Epilepsy Guidance', description: 'UK NICE guidance for epilepsy management including pregnancy considerations.' },
      { url: 'https://www.aedpregnancyregistry.org/', label: 'North American AED Pregnancy Registry', description: 'Registry collecting data on antiepileptic drug use in pregnancy.' },
      { url: 'http://www.eurapinternational.org/', label: 'EURAP International AED & Pregnancy Registry', description: 'International registry monitoring outcomes of pregnancies exposed to AEDs.' },
      { url: 'https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm', label: 'DailyMed API – Drug Labeling', description: 'NLM DailyMed API providing structured product labeling including pregnancy sections.' },
      // Removed FDA links that failed automated checks (access/availability varies)
      { url: 'https://www.cdc.gov/epilepsy/about/first-aid.htm', label: 'CDC – Seizure First Aid', description: 'Official guidance on what to do when someone has a seizure.' },
      { url: 'https://www.epilepsysociety.org.uk/pregnancy-and-epilepsy', label: 'Epilepsy Society – Pregnancy and Epilepsy', description: 'Information and support around epilepsy during pregnancy.' }
    ]

    return { pdfs, links }
  }, [])

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
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Knowledge & Resources</h1>
                <p className="text-gray-600">
                  Educational resources and medical terms for epilepsy and pregnancy
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('knowledge')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'knowledge'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Knowledge Base
                </button>
                <button
                  onClick={() => setActiveTab('glossary')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'glossary'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Medical Terms Glossary
                </button>
              </nav>
            </div>
          </div>

          {/* Knowledge Tab Content */}
          {activeTab === 'knowledge' && (
            <>
              {/* Aggregated Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Featured PDFs</h3>
              {aggregated.pdfs.length === 0 ? (
                <p className="text-sm text-gray-500">No PDFs found.</p>
              ) : (
                <ul className="space-y-2">
                  {aggregated.pdfs.slice(0, 12).map((p) => (
                    <li key={p.url} className="truncate">
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Helpful Links</h3>
              {aggregated.links.length === 0 ? (
                <p className="text-sm text-gray-500">No links found.</p>
              ) : (
                <ul className="space-y-3">
                  {aggregated.links.slice(0, 16).map((l) => (
                    <li key={l.url} className="text-sm text-gray-700">
                      <span className="text-gray-600">
                        {l.description ? cleanDescription(l.description) + ' — ' : ''}
                      </span>
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Knowledge Items removed per UX */}

              {/* Important Notice */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Knowledge Base Notice</h3>
                    <p className="text-blue-800 mb-4">
                      This knowledge base contains educational resources and should not replace professional medical advice. 
                      Always consult your healthcare provider for personalized medical guidance.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Resources are for educational purposes only</li>
                      <li>• Always consult your doctor before making medical decisions</li>
                      <li>• Individual situations may vary</li>
                      <li>• Seek immediate medical attention for emergencies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Glossary Tab Content */}
          {activeTab === 'glossary' && (
            <>
              {/* Glossary Search and Filters */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search medical terms..."
                        value={glossarySearchTerm}
                        onChange={(e) => handleGlossarySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-600" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      {getCategories().map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Letter Filter */}
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-gray-600" />
                    <select
                      value={selectedLetter}
                      onChange={(e) => handleLetterFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Letters</option>
                      {getLetters().map((letter) => (
                        <option key={letter} value={letter}>{letter}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms Table (scrollable) */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                {filteredTerms.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                  </div>
                ) : (
                  <div className="max-h-[32rem] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Form</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Definition</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Related Terms</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTerms.map((term) => (
                          <tr key={term.term} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{term.term}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{term.full_form || '—'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{term.category}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-[420px]">{term.definition}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 max-w-[320px]">
                              {term.related_terms && term.related_terms.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {term.related_terms.map((rt, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">{rt}</span>
                                  ))}
                                </div>
                              ) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  )
}
