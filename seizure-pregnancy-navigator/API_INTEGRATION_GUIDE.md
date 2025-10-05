# 🚀 API Integration Implementation Guide

## 📋 Overview
This guide shows you exactly how and where to implement the planned API integrations in the Seizure Pregnancy Navigator application.

## 🏗️ Current Architecture
- **Framework**: Next.js 14 with App Router
- **API Routes**: `/app/api/` directory
- **Current Data**: Static JSON files
- **Target**: Add real-time API integrations

## 🔧 Implementation Steps

### 1. Environment Configuration

#### Create `.env.local` file:
```bash
# API Keys
OPENFDA_API_KEY=your_openfda_api_key_here
NIH_API_KEY=your_nih_api_key_here
CDC_API_KEY=your_cdc_api_key_here

# API Base URLs
OPENFDA_BASE_URL=https://api.fda.gov
NIH_BASE_URL=https://dailymed.nlm.nih.gov
CDC_BASE_URL=https://data.cdc.gov

# Rate Limiting
API_RATE_LIMIT=100
API_RATE_WINDOW=60000
```

### 2. API Service Layer

#### Create `/lib/api-services.ts`:
```typescript
// API service layer for external integrations
export class APIService {
  private baseURL: string
  private apiKey: string
  private rateLimit: number
  private rateWindow: number

  constructor(baseURL: string, apiKey: string, rateLimit = 100, rateWindow = 60000) {
    this.baseURL = baseURL
    this.apiKey = apiKey
    this.rateLimit = rateLimit
    this.rateWindow = rateWindow
  }

  async fetchWithRetry(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API fetch failed for ${endpoint}:`, error)
      throw error
    }
  }
}

// Specific API services
export class OpenFDAService extends APIService {
  constructor() {
    super(
      process.env.OPENFDA_BASE_URL || 'https://api.fda.gov',
      process.env.OPENFDA_API_KEY || '',
      100,
      60000
    )
  }

  async getDrugLabeling(drugName: string) {
    return this.fetchWithRetry(`/drug/label.json?search=openfda.brand_name:"${drugName}"`)
  }

  async getAdverseEvents(drugName: string) {
    return this.fetchWithRetry(`/drug/event.json?search=patient.drug.medicinalproduct:"${drugName}"`)
  }
}

export class DailyMedService extends APIService {
  constructor() {
    super(
      process.env.NIH_BASE_URL || 'https://dailymed.nlm.nih.gov',
      process.env.NIH_API_KEY || '',
      50,
      60000
    )
  }

  async getMedicationInfo(ndc: string) {
    return this.fetchWithRetry(`/dailymed/services/v2/spls/${ndc}.json`)
  }
}

export class CDCService extends APIService {
  constructor() {
    super(
      process.env.CDC_BASE_URL || 'https://data.cdc.gov',
      process.env.CDC_API_KEY || '',
      200,
      60000
    )
  }

  async getPregnancyGuidelines() {
    return this.fetchWithRetry('/api/views/pregnancy-guidelines/rows.json')
  }
}
```

### 3. API Route Implementations

#### Create `/app/api/external/openfda/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { OpenFDAService } from '@/lib/api-services'

const openFDAService = new OpenFDAService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const drugName = searchParams.get('drug')
    const type = searchParams.get('type') || 'labeling'

    if (!drugName) {
      return NextResponse.json(
        { error: 'Drug name is required' },
        { status: 400 }
      )
    }

    let data
    if (type === 'labeling') {
      data = await openFDAService.getDrugLabeling(drugName)
    } else if (type === 'adverse') {
      data = await openFDAService.getAdverseEvents(drugName)
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "labeling" or "adverse"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'OpenFDA API',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('OpenFDA API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from OpenFDA',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

#### Create `/app/api/external/dailymed/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { DailyMedService } from '@/lib/api-services'

const dailyMedService = new DailyMedService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ndc = searchParams.get('ndc')

    if (!ndc) {
      return NextResponse.json(
        { error: 'NDC code is required' },
        { status: 400 }
      )
    }

    const data = await dailyMedService.getMedicationInfo(ndc)

    return NextResponse.json({
      success: true,
      data,
      source: 'NIH DailyMed API',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('DailyMed API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from DailyMed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

#### Create `/app/api/external/cdc/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { CDCService } from '@/lib/api-services'

const cdcService = new CDCService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'guidelines'

    let data
    if (type === 'guidelines') {
      data = await cdcService.getPregnancyGuidelines()
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "guidelines"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'CDC API',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('CDC API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from CDC',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
```

### 4. Enhanced Medication API with External Data

#### Update `/app/api/medications/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { OpenFDAService } from '@/lib/api-services'

const openFDAService = new OpenFDAService()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const drugName = searchParams.get('drug')
    const includeExternal = searchParams.get('external') === 'true'

    // Load local data first
    const dataPath = path.join(process.cwd(), '..', 'data', 'epilepsy_medication_safety_database.json')
    let localData = {}
    
    if (fs.existsSync(dataPath)) {
      localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }

    // If external data is requested and drug name is provided
    if (includeExternal && drugName) {
      try {
        const externalData = await openFDAService.getDrugLabeling(drugName)
        
        return NextResponse.json({
          success: true,
          local: localData,
          external: {
            source: 'OpenFDA API',
            data: externalData,
            timestamp: new Date().toISOString()
          }
        })
      } catch (externalError) {
        console.warn('External API failed, returning local data only:', externalError)
        return NextResponse.json({
          success: true,
          local: localData,
          external: {
            error: 'External API unavailable',
            fallback: true
          }
        })
      }
    }

    return NextResponse.json(localData)

  } catch (error) {
    console.error('Error loading medication data:', error)
    return NextResponse.json(
      { error: 'Failed to load medication data' },
      { status: 500 }
    )
  }
}
```

### 5. Frontend Integration

#### Create `/components/ExternalDataIndicator.tsx`:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface ExternalDataIndicatorProps {
  source: string
  timestamp?: string
  error?: boolean
}

export default function ExternalDataIndicator({ source, timestamp, error }: ExternalDataIndicatorProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (error) {
      setStatus('error')
    } else if (timestamp) {
      setStatus('success')
    }
  }, [error, timestamp])

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status === 'loading' && <Clock className="w-4 h-4 text-yellow-500 animate-spin" />}
      {status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
      {status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
      
      <span className={`text-xs ${
        status === 'success' ? 'text-green-600' : 
        status === 'error' ? 'text-red-600' : 
        'text-yellow-600'
      }`}>
        {status === 'success' ? `Live data from ${source}` :
         status === 'error' ? `Using cached data (${source} unavailable)` :
         'Loading external data...'}
      </span>
    </div>
  )
}
```

#### Update medication page to use external data:
```typescript
// In your medication page component
const [medicationData, setMedicationData] = useState(null)
const [externalData, setExternalData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchMedicationData = async () => {
    try {
      const response = await fetch('/api/medications?external=true&drug=lamotrigine')
      const data = await response.json()
      
      setMedicationData(data.local)
      setExternalData(data.external)
    } catch (error) {
      console.error('Failed to fetch medication data:', error)
    } finally {
      setLoading(false)
    }
  }

  fetchMedicationData()
}, [])
```

### 6. Caching and Performance

#### Create `/lib/cache.ts`:
```typescript
// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function setCache(key: string, data: any, ttl = 300000) { // 5 minutes default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export function getCache(key: string) {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export function clearCache() {
  cache.clear()
}
```

### 7. Error Handling and Fallbacks

#### Create `/lib/error-handler.ts`:
```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public source: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown, source: string) {
  if (error instanceof APIError) {
    return {
      error: error.message,
      status: error.status,
      source: error.source
    }
  }
  
  return {
    error: 'Unknown error occurred',
    status: 500,
    source
  }
}
```

## 🚀 Implementation Priority

### Phase 1: Basic Integration (Week 1-2)
1. ✅ Set up environment variables
2. ✅ Create API service layer
3. ✅ Implement OpenFDA integration
4. ✅ Add error handling and fallbacks

### Phase 2: Enhanced Features (Week 3-4)
1. ✅ Add DailyMed integration
2. ✅ Implement CDC guidelines
3. ✅ Add caching layer
4. ✅ Create frontend indicators

### Phase 3: Advanced Features (Week 5-6)
1. ✅ Add WHO and RCOG integrations
2. ✅ Implement real-time updates
3. ✅ Add data synchronization
4. ✅ Performance optimization

## 📁 File Structure
```
seizure-pregnancy-navigator/
├── app/
│   └── api/
│       ├── external/
│       │   ├── openfda/
│       │   │   └── route.ts
│       │   ├── dailymed/
│       │   │   └── route.ts
│       │   └── cdc/
│       │       └── route.ts
│       ├── medications/
│       │   └── route.ts (updated)
│       └── pregnancy/
│           └── route.ts
├── lib/
│   ├── api-services.ts
│   ├── cache.ts
│   └── error-handler.ts
├── components/
│   └── ExternalDataIndicator.tsx
└── .env.local
```

## 🔑 API Keys Setup

### OpenFDA API
1. Visit: https://open.fda.gov/apis/
2. Register for API key
3. Add to `.env.local`: `OPENFDA_API_KEY=your_key_here`

### NIH DailyMed API
1. Visit: https://dailymed.nlm.nih.gov/dailymed/
2. Request API access
3. Add to `.env.local`: `NIH_API_KEY=your_key_here`

### CDC API
1. Visit: https://data.cdc.gov/
2. Register for API access
3. Add to `.env.local`: `CDC_API_KEY=your_key_here`

## 🧪 Testing

### Test API endpoints:
```bash
# Test OpenFDA
curl "http://localhost:3000/api/external/openfda?drug=lamotrigine&type=labeling"

# Test DailyMed
curl "http://localhost:3000/api/external/dailymed?ndc=12345-678-90"

# Test CDC
curl "http://localhost:3000/api/external/cdc?type=guidelines"

# Test enhanced medications
curl "http://localhost:3000/api/medications?external=true&drug=lamotrigine"
```

## 📊 Monitoring

### Add API monitoring:
```typescript
// In your API routes
const startTime = Date.now()
// ... API call ...
const duration = Date.now() - startTime

console.log(`API call to ${source} took ${duration}ms`)
```

This implementation provides a robust foundation for integrating external APIs while maintaining the existing static data as fallbacks.
