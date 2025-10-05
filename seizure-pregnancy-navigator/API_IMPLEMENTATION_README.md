# 🚀 API Integration Implementation Guide

## 📋 Quick Start

### 1. **Set Up Environment Variables**
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your actual API keys
nano .env.local
```

### 2. **Install Dependencies** (if needed)
```bash
npm install
```

### 3. **Start the Development Server**
```bash
npm run dev
```

### 4. **Test the API Integrations**
```bash
# Run the test script
node scripts/test-api-integrations.js

# Or test manually with curl
curl "http://localhost:3000/api/external/openfda?drug=lamotrigine&type=labeling"
```

## 🔧 Implementation Details

### **File Structure Created:**
```
seizure-pregnancy-navigator/
├── lib/
│   ├── api-services.ts          # API service classes
│   ├── cache.ts                 # Caching utilities
│   └── error-handler.ts         # Error handling
├── app/api/external/
│   ├── openfda/route.ts         # OpenFDA integration
│   ├── dailymed/route.ts        # DailyMed integration
│   └── cdc/route.ts             # CDC integration
├── app/api/medications/
│   └── enhanced/route.ts        # Enhanced medications API
├── components/
│   ├── ExternalDataIndicator.tsx    # UI indicator
│   └── MedicationWithExternalData.tsx # Example component
├── scripts/
│   └── test-api-integrations.js     # Testing script
└── API_INTEGRATION_GUIDE.md         # This guide
```

## 🎯 **How to Implement Each API**

### **1. OpenFDA API Integration**

#### **Where to implement:**
- **API Route**: `/app/api/external/openfda/route.ts`
- **Service**: `/lib/api-services.ts` (OpenFDAService class)
- **Frontend**: Use in medication pages

#### **What it provides:**
- Drug labeling information
- Adverse event reports
- Drug recall information

#### **Usage Example:**
```typescript
// In your React component
const [drugData, setDrugData] = useState(null)

useEffect(() => {
  const fetchDrugData = async () => {
    const response = await fetch('/api/external/openfda?drug=lamotrigine&type=labeling')
    const data = await response.json()
    setDrugData(data)
  }
  fetchDrugData()
}, [])
```

### **2. NIH DailyMed API Integration**

#### **Where to implement:**
- **API Route**: `/app/api/external/dailymed/route.ts`
- **Service**: `/lib/api-services.ts` (DailyMedService class)
- **Frontend**: Use in medication safety pages

#### **What it provides:**
- Structured Product Labeling (SPL)
- Pregnancy and lactation warnings
- Medication instructions

#### **Usage Example:**
```typescript
// Search for medications
const response = await fetch('/api/external/dailymed?search=lamotrigine')
const data = await response.json()
```

### **3. CDC API Integration**

#### **Where to implement:**
- **API Route**: `/app/api/external/cdc/route.ts`
- **Service**: `/lib/api-services.ts` (CDCService class)
- **Frontend**: Use in pregnancy guidance pages

#### **What it provides:**
- Pregnancy guidelines
- Reproductive health data
- Public health recommendations

#### **Usage Example:**
```typescript
// Get pregnancy guidelines
const response = await fetch('/api/external/cdc?type=guidelines')
const data = await response.json()
```

## 🔄 **Enhanced Data Flow**

### **Current Flow:**
```
Frontend → API Route → Static JSON Files → Response
```

### **New Enhanced Flow:**
```
Frontend → API Route → External APIs + Static Files → Cached Response
```

### **Implementation Steps:**

1. **Create API Service Classes** ✅
   - `OpenFDAService`
   - `DailyMedService` 
   - `CDCService`

2. **Create API Routes** ✅
   - `/api/external/openfda`
   - `/api/external/dailymed`
   - `/api/external/cdc`

3. **Enhance Existing APIs** ✅
   - Update `/api/medications` to include external data
   - Add fallback to static data

4. **Add Frontend Components** ✅
   - `ExternalDataIndicator` for showing data source
   - `MedicationWithExternalData` for enhanced medication display

5. **Implement Caching** ✅
   - In-memory cache for API responses
   - TTL-based expiration

## 🧪 **Testing Your Implementation**

### **1. Test Individual APIs:**
```bash
# Test OpenFDA
curl "http://localhost:3000/api/external/openfda?drug=lamotrigine&type=labeling"

# Test DailyMed
curl "http://localhost:3000/api/external/dailymed?search=lamotrigine"

# Test CDC
curl "http://localhost:3000/api/external/cdc?type=guidelines"
```

### **2. Test Enhanced Medications:**
```bash
# With external data
curl "http://localhost:3000/api/medications/enhanced?external=true&drug=lamotrigine"

# Local data only
curl "http://localhost:3000/api/medications/enhanced?external=false&drug=lamotrigine"
```

### **3. Run Automated Tests:**
```bash
node scripts/test-api-integrations.js
```

## 🎨 **Frontend Integration Examples**

### **1. Basic Usage:**
```tsx
import { MedicationWithExternalData } from '@/components/MedicationWithExternalData'

export default function MedicationPage() {
  return (
    <div>
      <MedicationWithExternalData drugName="lamotrigine" />
    </div>
  )
}
```

### **2. Custom Implementation:**
```tsx
import { ExternalDataIndicator } from '@/components/ExternalDataIndicator'

export default function CustomMedicationComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/medications/enhanced?external=true&drug=lamotrigine')
      const result = await response.json()
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div>
      <ExternalDataIndicator 
        source={data?.external?.source}
        timestamp={data?.external?.timestamp}
        error={data?.external?.error}
        loading={loading}
      />
      {/* Your medication content */}
    </div>
  )
}
```

## 🔑 **API Keys Setup**

### **OpenFDA API:**
1. Visit: https://open.fda.gov/apis/
2. Register for free API key
3. Add to `.env.local`: `OPENFDA_API_KEY=your_key_here`

### **NIH DailyMed API:**
1. Visit: https://dailymed.nlm.nih.gov/dailymed/
2. Request API access
3. Add to `.env.local`: `NIH_API_KEY=your_key_here`

### **CDC API:**
1. Visit: https://data.cdc.gov/
2. Register for API access
3. Add to `.env.local`: `CDC_API_KEY=your_key_here`

## 🚨 **Important Notes**

### **Rate Limiting:**
- OpenFDA: 1000 requests per hour
- DailyMed: 50 requests per minute
- CDC: 200 requests per hour

### **Error Handling:**
- All APIs have fallback to static data
- Graceful degradation when external APIs fail
- User-friendly error messages

### **Caching:**
- 5-minute cache for API responses
- Automatic cleanup of expired entries
- Reduces API calls and improves performance

## 📊 **Monitoring and Debugging**

### **Enable Debug Mode:**
```bash
# In .env.local
DEBUG_API_CALLS=true
```

### **Check API Status:**
```bash
# Check if APIs are responding
curl "http://localhost:3000/api/external/openfda?drug=test&type=labeling"
```

### **View Cache Stats:**
```typescript
import { getCacheStats } from '@/lib/cache'
console.log(getCacheStats())
```

## 🎯 **Next Steps**

1. **Get API Keys** - Register for the APIs you want to use
2. **Test Integration** - Run the test script to verify everything works
3. **Customize Frontend** - Use the example components in your pages
4. **Add More APIs** - Extend with WHO, RCOG, or other medical APIs
5. **Production Setup** - Configure proper error handling and monitoring

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **"API Error: 401 Unauthorized"**
   - Check your API keys in `.env.local`
   - Verify the API key is correct

2. **"Failed to fetch data from OpenFDA"**
   - Check your internet connection
   - Verify the API endpoint is correct

3. **"External API unavailable"**
   - This is normal - the app falls back to static data
   - Check the console for specific error messages

### **Debug Steps:**
1. Check `.env.local` has correct API keys
2. Verify the development server is running
3. Test individual API endpoints with curl
4. Check browser console for errors
5. Run the test script to verify all integrations

This implementation provides a robust foundation for integrating external medical APIs while maintaining the existing functionality and providing graceful fallbacks.
