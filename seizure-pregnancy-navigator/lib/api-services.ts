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

// OpenFDA API Service
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

  async getDrugRecalls(drugName: string) {
    return this.fetchWithRetry(`/drug/recall.json?search=product_description:"${drugName}"`)
  }
}

// NIH DailyMed API Service
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

  async searchMedications(searchTerm: string) {
    return this.fetchWithRetry(`/dailymed/services/v2/spls.json?search=${encodeURIComponent(searchTerm)}`)
  }
}

// CDC API Service
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
    // Use CDC's actual API endpoints
    return this.fetchWithRetry('/api/views/5b7a-4f3c/rows.json?accessType=DOWNLOAD')
  }

  async getReproductiveHealthData() {
    // Use CDC's reproductive health data
    return this.fetchWithRetry('/api/views/9bh8-h4zm/rows.json?accessType=DOWNLOAD')
  }

  async getMaternalHealthData() {
    // Use CDC's maternal health data
    return this.fetchWithRetry('/api/views/6b7a-4f3c/rows.json?accessType=DOWNLOAD')
  }
}

// WHO API Service (if available)
export class WHOService extends APIService {
  constructor() {
    super(
      process.env.WHO_BASE_URL || 'https://apps.who.int',
      process.env.WHO_API_KEY || '',
      50,
      60000
    )
  }

  async getEpilepsyGuidelines() {
    return this.fetchWithRetry('/api/epilepsy-guidelines')
  }
}

// Epilepsy Foundation API Service
export class EpilepsyFoundationService extends APIService {
  constructor() {
    super(
      process.env.EPILEPSY_FOUNDATION_BASE_URL || 'https://www.epilepsy.com',
      process.env.EPILEPSY_FOUNDATION_API_KEY || '',
      100,
      60000
    )
  }

  async getSeizureResources() {
    return this.fetchWithRetry('/api/resources')
  }

  async getSupportGroups() {
    return this.fetchWithRetry('/api/support-groups')
  }
}
