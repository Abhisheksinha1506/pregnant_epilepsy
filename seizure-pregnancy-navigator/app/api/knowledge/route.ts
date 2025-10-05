import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type KnowledgeItem = {
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
  // New fields for improved UX in Knowledge Center
  raw?: string
  tableSample?: any[]
  columns?: string[]
}

function safeReadJSON(filePath: string): any | null {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    }
  } catch (_err) {
    // ignore; will fallback
  }
  return null
}

function parseCSV(content: string): any[] {
  try {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []
    
    const headers = lines[0].split(',').map(h => h.trim())
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const obj: any = {}
      headers.forEach((header, i) => {
        obj[header] = values[i] || ''
      })
      return obj
    })
    return rows
  } catch (_err) {
    return []
  }
}

function parseXML(content: string): any {
  try {
    // Simple XML parsing - extract text content from tags
    const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return { content: textContent }
  } catch (_err) {
    return { content: content.slice(0, 500) }
  }
}

function extractTitleFromContent(content: string, filename: string): string {
  // Try to find title in content
  const titleMatch = content.match(/^#\s+(.+)$/m) || 
                   content.match(/^title:\s*(.+)$/im) ||
                   content.match(/^#\s*([^#\n]+)/m)
  
  if (titleMatch) {
    return titleMatch[1].trim()
  }
  
  // Fallback to filename with better formatting
  const baseName = filename.replace(/\.(txt|md|json|csv|xml)$/i, '')
  return baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

function extractReadableContent(content: string, maxLength: number = 280): string {
  // Remove JSON artifacts and extract readable text
  let cleanContent = content
  
  // If it's JSON, try to extract meaningful text
  if (content.startsWith('{') || content.startsWith('[')) {
    try {
      const parsed = JSON.parse(content)
      
      // Try different JSON structures
      if (parsed.sections && Array.isArray(parsed.sections)) {
        // Extract from sections
        const textParts = parsed.sections
          .filter((s: any) => s.content && Array.isArray(s.content))
          .map((s: any) => s.content.join(' '))
          .join(' ')
        cleanContent = textParts || content
      } else if (parsed.content && Array.isArray(parsed.content)) {
        cleanContent = parsed.content.join(' ')
      } else if (parsed.description) {
        cleanContent = parsed.description
      } else if (parsed.sources && Array.isArray(parsed.sources)) {
        // Extract from sources
        const sourceText = parsed.sources
          .map((s: any) => s.description || s.content || '')
          .filter(Boolean)
          .join(' ')
        cleanContent = sourceText || content
      } else if (parsed.extraction_info) {
        // Skip extraction_info, look for other meaningful content
        const keys = Object.keys(parsed).filter(k => k !== 'extraction_info')
        if (keys.length > 0) {
          const firstKey = keys[0]
          if (typeof parsed[firstKey] === 'string') {
            cleanContent = parsed[firstKey]
          } else if (Array.isArray(parsed[firstKey])) {
            cleanContent = parsed[firstKey].join(' ')
          }
        }
      } else if (typeof parsed === 'string') {
        cleanContent = parsed
      }
    } catch (e) {
      // Keep original content if JSON parsing fails
    }
  }
  
  // Clean up the content more aggressively
  cleanContent = cleanContent
    .replace(/\{[^}]*\}/g, '') // Remove JSON objects
    .replace(/\[[^\]]*\]/g, '') // Remove arrays
    .replace(/"[^"]*":/g, '') // Remove JSON keys
    .replace(/https?:\/\/[^\s]+/g, '') // Remove URLs
    .replace(/[{}[\]"]/g, '') // Remove remaining JSON characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  // If content is still too technical, try to extract first meaningful sentence
  if (cleanContent.length < 50 || cleanContent.includes('extraction_info')) {
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 20)
    if (sentences.length > 0) {
      cleanContent = sentences[0].trim()
    }
  }
  
  // Truncate intelligently
  if (cleanContent.length > maxLength) {
    const truncated = cleanContent.slice(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    return lastSpace > maxLength * 0.8 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
  }
  
  return cleanContent || 'Information available in source file'
}

function extractMeaningfulContent(jsonData: any): string {
  // Extract meaningful content from JSON structures
  const contentParts: string[] = []
  
  // Look for common content fields
  if (jsonData.description) {
    contentParts.push(jsonData.description)
  }
  
  if (jsonData.sections && Array.isArray(jsonData.sections)) {
    for (const section of jsonData.sections) {
      if (section.title) contentParts.push(section.title)
      if (section.content && Array.isArray(section.content)) {
        contentParts.push(section.content.join(' '))
      }
    }
  }
  
  if (jsonData.sources && Array.isArray(jsonData.sources)) {
    for (const source of jsonData.sources) {
      if (source.description) contentParts.push(source.description)
      if (source.content && Array.isArray(source.content)) {
        contentParts.push(source.content.join(' '))
      }
    }
  }
  
  if (jsonData.lactation_guidelines && Array.isArray(jsonData.lactation_guidelines)) {
    for (const guideline of jsonData.lactation_guidelines) {
      if (guideline.topic) contentParts.push(guideline.topic)
      if (guideline.content && Array.isArray(guideline.content)) {
        contentParts.push(guideline.content.join(' '))
      }
    }
  }
  
  if (jsonData.pregnancy_categories && Array.isArray(jsonData.pregnancy_categories)) {
    for (const category of jsonData.pregnancy_categories) {
      if (category.category) contentParts.push(category.category)
      if (category.description) contentParts.push(category.description)
    }
  }
  
  // If no structured content found, try to extract from any string values
  if (contentParts.length === 0) {
    const extractStrings = (obj: any): string[] => {
      const strings: string[] = []
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'extraction_info') continue // Skip metadata
        if (typeof value === 'string' && value.length > 10) {
          strings.push(value)
        } else if (typeof value === 'object' && value !== null) {
          strings.push(...extractStrings(value))
        }
      }
      return strings
    }
    contentParts.push(...extractStrings(jsonData))
  }
  
  return contentParts.join(' ').slice(0, 500)
}

function categorizeFile(filename: string, content: string): { type: KnowledgeItem['type'], category: string, tags: string[] } {
  const lowerContent = content.toLowerCase()
  const lowerFilename = filename.toLowerCase()
  
  // Emergency and safety information
  if (lowerFilename.includes('emergency') || lowerContent.includes('emergency') || 
      lowerContent.includes('first aid') || lowerContent.includes('safety')) {
    return { type: 'support', category: 'Emergency & Safety', tags: ['emergency', 'first-aid', 'safety'] }
  }
  
  // Medication and drug information
  if (lowerFilename.includes('medication') || lowerContent.includes('medication') || 
      lowerContent.includes('drug') || lowerContent.includes('lamotrigine') || 
      lowerContent.includes('keppra') || lowerContent.includes('depakote')) {
    return { type: 'guide', category: 'Medications & Drugs', tags: ['medications', 'drugs', 'safety'] }
  }
  
  // Pregnancy-specific information
  if (lowerFilename.includes('pregnancy') || lowerContent.includes('pregnancy') ||
      lowerContent.includes('maternal') || lowerContent.includes('prenatal')) {
    return { type: 'guide', category: 'Pregnancy Care', tags: ['pregnancy', 'maternal', 'prenatal'] }
  }
  
  // Seizure and epilepsy information
  if (lowerFilename.includes('seizure') || lowerContent.includes('seizure') ||
      lowerContent.includes('epilepsy') || lowerContent.includes('epileptic')) {
    return { type: 'guide', category: 'Seizures & Epilepsy', tags: ['seizures', 'epilepsy', 'neurological'] }
  }
  
  // Research and clinical data
  if (lowerFilename.includes('research') || lowerContent.includes('study') || 
      lowerContent.includes('clinical') || lowerContent.includes('registry')) {
    return { type: 'research', category: 'Research & Studies', tags: ['research', 'clinical', 'studies'] }
  }
  
  // Guidelines and protocols
  if (lowerFilename.includes('guideline') || lowerContent.includes('guideline') ||
      lowerContent.includes('protocol') || lowerContent.includes('recommendation')) {
    return { type: 'research', category: 'Clinical Guidelines', tags: ['guidelines', 'clinical', 'protocols'] }
  }
  
  // Documentation and user guides
  if (lowerFilename.includes('guide') || lowerFilename.includes('documentation') ||
      lowerContent.includes('user guide') || lowerContent.includes('documentation')) {
    return { type: 'guide', category: 'Documentation', tags: ['documentation', 'guides', 'help'] }
  }
  
  // Tracking and monitoring
  if (lowerFilename.includes('tracking') || lowerFilename.includes('schedule') ||
      lowerFilename.includes('log') || lowerContent.includes('monitoring')) {
    return { type: 'guide', category: 'Tracking & Monitoring', tags: ['tracking', 'monitoring', 'schedules'] }
  }
  
  return { type: 'article', category: 'General Information', tags: ['general', 'information'] }
}

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), '..', 'data')
    const knowledgeItems: KnowledgeItem[] = []

    // Get all files in data directory
    const files = fs.readdirSync(dataDir)
    
    for (const file of files) {
      const filePath = path.join(dataDir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) continue
      
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        const ext = path.extname(file).toLowerCase()
        
        let items: any[] = []
        let source = 'Local Data'
        
        // Parse based on file type
        if (ext === '.json') {
          const jsonData = safeReadJSON(filePath)
          if (jsonData) {
            // Handle different JSON structures
            if (Array.isArray(jsonData)) {
              items = jsonData
            } else if (jsonData.web_sources && Array.isArray(jsonData.web_sources)) {
              // epilepsy_pregnancy_comprehensive_data.json structure
              for (const src of jsonData.web_sources) {
                if (src.epilepsy_pregnancy_info && Array.isArray(src.epilepsy_pregnancy_info)) {
                  for (const item of src.epilepsy_pregnancy_info) {
                    items.push({
                      title: item.title || 'Untitled',
                      content: Array.isArray(item.content) ? item.content.join(' ') : '',
                      source: src.source || 'Unknown Source',
                      url: Array.isArray(item.content) ? item.content.find(c => /https?:\/\//.test(c)) : undefined,
                      raw: JSON.stringify(item, null, 2),
                      tableSample: undefined,
                      columns: undefined
                    })
                  }
                }
              }
            } else if (jsonData.medications && Array.isArray(jsonData.medications)) {
              // medication database structure
              items = jsonData.medications.map((med: any) => ({
                title: `${med.name || 'Medication'} - Safety Information`,
                content: med.pregnancy_safety || med.description || '',
                source: 'Medication Database',
                raw: JSON.stringify(med, null, 2),
                tableSample: [med],
                columns: Object.keys(med || {})
              }))
            } else if (jsonData.pdfs && Array.isArray(jsonData.pdfs)) {
              // pdf_database.json structure
              items = jsonData.pdfs.map((pdf: any) => ({
                title: pdf.title || 'Clinical PDF',
                content: pdf.summary || '',
                source: 'PDF Database',
                url: pdf.url,
                raw: JSON.stringify(pdf, null, 2),
                tableSample: [pdf],
                columns: Object.keys(pdf || {})
              }))
            } else {
              // Generic JSON - extract meaningful content based on structure
              const meaningfulContent = extractMeaningfulContent(jsonData)
              // Derive a human-readable source from filename
              const baseName = file.replace(/\.[^.]*$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              // Prepare table sample without heavy nested fields like 'sections'
              let tableRow: any | undefined
              if (Array.isArray(jsonData)) {
                tableRow = undefined
              } else if (typeof jsonData === 'object' && jsonData !== null) {
                const { sections, extraction_info, ...rest } = jsonData as any
                tableRow = rest
              }
              items = [{
                title: extractTitleFromContent(meaningfulContent, file),
                content: meaningfulContent,
                source: baseName,
                raw: JSON.stringify(jsonData, null, 2),
                tableSample: Array.isArray(jsonData) ? jsonData.slice(0, 10) : (tableRow ? [tableRow] : undefined),
                columns: Array.isArray(jsonData) && jsonData.length > 0 && typeof jsonData[0] === 'object'
                  ? Object.keys(jsonData[0]).filter(k => k !== 'sections' && k !== 'extraction_info')
                  : (tableRow ? Object.keys(tableRow).filter(k => k !== 'sections' && k !== 'extraction_info') : undefined)
              }]
            }
          }
        } else if (ext === '.txt') {
          items = [{
            title: extractTitleFromContent(content, file),
            content: content,
            source: 'Text File',
            raw: content
          }]
        } else if (ext === '.md') {
          items = [{
            title: extractTitleFromContent(content, file),
            content: content,
            source: 'Markdown File',
            raw: content
          }]
        } else if (ext === '.xml') {
          const xmlData = parseXML(content)
          items = [{
            title: extractTitleFromContent(content, file),
            content: xmlData.content,
            source: 'XML File',
            raw: content
          }]
        } else if (ext === '.csv') {
          const csvData = parseCSV(content)
          items = csvData.map((row, index) => ({
            title: `${extractTitleFromContent(content, file)} - Row ${index + 1}`,
            content: Object.values(row).join(' '),
            source: 'CSV Data',
            raw: JSON.stringify(row, null, 2),
            tableSample: [row],
            columns: Object.keys(row || {})
          }))
        }
        
        // Convert items to KnowledgeItem format
        for (const item of items) {
          if (!item.title || !item.content) continue
          
          const { type, category, tags } = categorizeFile(file, item.content)
          const description = extractReadableContent(item.content, 280)
          const cleanTitle = extractTitleFromContent(item.title, file)
          
          knowledgeItems.push({
            id: `${file}_${item.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: cleanTitle,
            type,
            category,
            description,
            source: item.source || source,
            url: item.url,
            tags: [...tags, file.replace(/\.[^.]*$/, '')],
            raw: typeof item.raw === 'string' ? item.raw : undefined,
            tableSample: Array.isArray(item.tableSample) ? item.tableSample.map((row: any) => {
              if (row && typeof row === 'object' && 'extraction_info' in row) {
                const { extraction_info, ...rest } = row
                return rest
              }
              return row
            }).slice(0, 10) : undefined,
            columns: Array.isArray(item.columns) ? item.columns.filter((c: string) => c !== 'extraction_info') : (Array.isArray(item.tableSample) && item.tableSample.length > 0 && typeof item.tableSample[0] === 'object' ? Object.keys(item.tableSample[0]).filter(c => c !== 'extraction_info') : undefined)
          })
        }
        
      } catch (err) {
        console.warn(`Failed to parse file ${file}:`, err)
        continue
      }
    }

    // Deduplicate by id
    const unique: Record<string, KnowledgeItem> = {}
    for (const item of knowledgeItems) {
      if (!unique[item.id]) unique[item.id] = item
    }

    const result = Object.values(unique)

    return NextResponse.json({
      success: true,
      count: result.length,
      items: result,
      source: 'All Local Data Files',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error aggregating knowledge data:', error)
    return NextResponse.json({ success: false, items: [] }, { status: 500 })
  }
}