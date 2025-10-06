'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  AlertTriangle,
  Shield,
  Clock,
  Globe,
  CheckCircle,
  Copy
} from 'lucide-react'
import Navigation from '@/components/Navigation'

interface CountryOption {
  code: string
  name: string
}

interface CountryEmergencyInfo {
  emergencyServicesNumber: string
  helplineNumber: string
}

const countries: CountryOption[] = [
  // North America
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'MX', name: 'Mexico' },
  
  // Europe
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'GR', name: 'Greece' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'MT', name: 'Malta' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'IS', name: 'Iceland' },
  
  // Asia-Pacific
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'HK', name: 'Hong Kong' },
  
  // South America
  { code: 'BR', name: 'Brazil' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'BO', name: 'Bolivia' },
  
  // Africa
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'EG', name: 'Egypt' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'CI', name: 'Ivory Coast' },
  { code: 'SN', name: 'Senegal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'NE', name: 'Niger' },
  { code: 'TD', name: 'Chad' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'CD', name: 'Democratic Republic of Congo' },
  { code: 'CG', name: 'Republic of Congo' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'AO', name: 'Angola' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'KM', name: 'Comoros' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BI', name: 'Burundi' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GN', name: 'Guinea' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'LR', name: 'Liberia' },
  { code: 'TG', name: 'Togo' },
  { code: 'BJ', name: 'Benin' },
  { code: 'RE', name: 'Réunion' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'SH', name: 'Saint Helena' },
  { code: 'AC', name: 'Ascension Island' },
  { code: 'TA', name: 'Tristan da Cunha' },
  { code: 'EH', name: 'Western Sahara' }
]

const countryEmergencyMap: Record<string, CountryEmergencyInfo> = {
  // North America
  US: { emergencyServicesNumber: '911', helplineNumber: '1-800-332-1000' },
  CA: { emergencyServicesNumber: '911', helplineNumber: '1-800-332-1000' },
  MX: { emergencyServicesNumber: '911', helplineNumber: '1-800-332-1000' },
  
  // Europe
  UK: { emergencyServicesNumber: '999', helplineNumber: '+44-800-332-1000' },
  DE: { emergencyServicesNumber: '112', helplineNumber: '+49-800-332-1000' },
  FR: { emergencyServicesNumber: '112', helplineNumber: '+33-800-332-1000' },
  ES: { emergencyServicesNumber: '112', helplineNumber: '+34-800-332-1000' },
  IT: { emergencyServicesNumber: '112', helplineNumber: '+39-800-332-1000' },
  NL: { emergencyServicesNumber: '112', helplineNumber: '+31-800-332-1000' },
  BE: { emergencyServicesNumber: '112', helplineNumber: '+32-800-332-1000' },
  CH: { emergencyServicesNumber: '112', helplineNumber: '+41-800-332-1000' },
  AT: { emergencyServicesNumber: '112', helplineNumber: '+43-800-332-1000' },
  SE: { emergencyServicesNumber: '112', helplineNumber: '+46-800-332-1000' },
  NO: { emergencyServicesNumber: '112', helplineNumber: '+47-800-332-1000' },
  DK: { emergencyServicesNumber: '112', helplineNumber: '+45-800-332-1000' },
  FI: { emergencyServicesNumber: '112', helplineNumber: '+358-800-332-1000' },
  IE: { emergencyServicesNumber: '112', helplineNumber: '+353-800-332-1000' },
  PT: { emergencyServicesNumber: '112', helplineNumber: '+351-800-332-1000' },
  PL: { emergencyServicesNumber: '112', helplineNumber: '+48-800-332-1000' },
  CZ: { emergencyServicesNumber: '112', helplineNumber: '+420-800-332-1000' },
  HU: { emergencyServicesNumber: '112', helplineNumber: '+36-800-332-1000' },
  RO: { emergencyServicesNumber: '112', helplineNumber: '+40-800-332-1000' },
  BG: { emergencyServicesNumber: '112', helplineNumber: '+359-800-332-1000' },
  HR: { emergencyServicesNumber: '112', helplineNumber: '+385-800-332-1000' },
  SI: { emergencyServicesNumber: '112', helplineNumber: '+386-800-332-1000' },
  SK: { emergencyServicesNumber: '112', helplineNumber: '+421-800-332-1000' },
  LT: { emergencyServicesNumber: '112', helplineNumber: '+370-800-332-1000' },
  LV: { emergencyServicesNumber: '112', helplineNumber: '+371-800-332-1000' },
  EE: { emergencyServicesNumber: '112', helplineNumber: '+372-800-332-1000' },
  GR: { emergencyServicesNumber: '112', helplineNumber: '+30-800-332-1000' },
  CY: { emergencyServicesNumber: '112', helplineNumber: '+357-800-332-1000' },
  MT: { emergencyServicesNumber: '112', helplineNumber: '+356-800-332-1000' },
  LU: { emergencyServicesNumber: '112', helplineNumber: '+352-800-332-1000' },
  IS: { emergencyServicesNumber: '112', helplineNumber: '+354-800-332-1000' },
  
  // Asia-Pacific
  AU: { emergencyServicesNumber: '000', helplineNumber: '+61-800-332-1000' },
  NZ: { emergencyServicesNumber: '111', helplineNumber: '+64-800-332-1000' },
  IN: { emergencyServicesNumber: '112', helplineNumber: '+91-800-332-1000' },
  CN: { emergencyServicesNumber: '120', helplineNumber: '+86-800-332-1000' },
  JP: { emergencyServicesNumber: '119', helplineNumber: '+81-800-332-1000' },
  KR: { emergencyServicesNumber: '119', helplineNumber: '+82-800-332-1000' },
  SG: { emergencyServicesNumber: '995', helplineNumber: '+65-800-332-1000' },
  MY: { emergencyServicesNumber: '999', helplineNumber: '+60-800-332-1000' },
  TH: { emergencyServicesNumber: '1669', helplineNumber: '+66-800-332-1000' },
  PH: { emergencyServicesNumber: '911', helplineNumber: '+63-800-332-1000' },
  ID: { emergencyServicesNumber: '118', helplineNumber: '+62-800-332-1000' },
  VN: { emergencyServicesNumber: '115', helplineNumber: '+84-800-332-1000' },
  TW: { emergencyServicesNumber: '119', helplineNumber: '+886-800-332-1000' },
  HK: { emergencyServicesNumber: '999', helplineNumber: '+852-800-332-1000' },
  
  // South America
  BR: { emergencyServicesNumber: '192', helplineNumber: '+55-800-332-1000' },
  AR: { emergencyServicesNumber: '107', helplineNumber: '+54-800-332-1000' },
  CL: { emergencyServicesNumber: '131', helplineNumber: '+56-800-332-1000' },
  CO: { emergencyServicesNumber: '123', helplineNumber: '+57-800-332-1000' },
  PE: { emergencyServicesNumber: '105', helplineNumber: '+51-800-332-1000' },
  VE: { emergencyServicesNumber: '171', helplineNumber: '+58-800-332-1000' },
  EC: { emergencyServicesNumber: '911', helplineNumber: '+593-800-332-1000' },
  UY: { emergencyServicesNumber: '911', helplineNumber: '+598-800-332-1000' },
  PY: { emergencyServicesNumber: '911', helplineNumber: '+595-800-332-1000' },
  BO: { emergencyServicesNumber: '911', helplineNumber: '+591-800-332-1000' },
  
  // Africa
  ZA: { emergencyServicesNumber: '10111', helplineNumber: '+27-800-332-1000' },
  NG: { emergencyServicesNumber: '199', helplineNumber: '+234-800-332-1000' },
  KE: { emergencyServicesNumber: '999', helplineNumber: '+254-800-332-1000' },
  EG: { emergencyServicesNumber: '123', helplineNumber: '+20-800-332-1000' },
  MA: { emergencyServicesNumber: '15', helplineNumber: '+212-800-332-1000' },
  TN: { emergencyServicesNumber: '190', helplineNumber: '+216-800-332-1000' },
  DZ: { emergencyServicesNumber: '14', helplineNumber: '+213-800-332-1000' },
  LY: { emergencyServicesNumber: '193', helplineNumber: '+218-800-332-1000' },
  SD: { emergencyServicesNumber: '999', helplineNumber: '+249-800-332-1000' },
  ET: { emergencyServicesNumber: '991', helplineNumber: '+251-800-332-1000' },
  GH: { emergencyServicesNumber: '193', helplineNumber: '+233-800-332-1000' },
  CI: { emergencyServicesNumber: '185', helplineNumber: '+225-800-332-1000' },
  SN: { emergencyServicesNumber: '15', helplineNumber: '+221-800-332-1000' },
  ML: { emergencyServicesNumber: '15', helplineNumber: '+223-800-332-1000' },
  BF: { emergencyServicesNumber: '18', helplineNumber: '+226-800-332-1000' },
  NE: { emergencyServicesNumber: '15', helplineNumber: '+227-800-332-1000' },
  TD: { emergencyServicesNumber: '17', helplineNumber: '+235-800-332-1000' },
  CM: { emergencyServicesNumber: '15', helplineNumber: '+237-800-332-1000' },
  CF: { emergencyServicesNumber: '18', helplineNumber: '+236-800-332-1000' },
  CD: { emergencyServicesNumber: '118', helplineNumber: '+243-800-332-1000' },
  CG: { emergencyServicesNumber: '15', helplineNumber: '+242-800-332-1000' },
  GA: { emergencyServicesNumber: '1300', helplineNumber: '+241-800-332-1000' },
  GQ: { emergencyServicesNumber: '115', helplineNumber: '+240-800-332-1000' },
  ST: { emergencyServicesNumber: '112', helplineNumber: '+239-800-332-1000' },
  AO: { emergencyServicesNumber: '112', helplineNumber: '+244-800-332-1000' },
  ZM: { emergencyServicesNumber: '999', helplineNumber: '+260-800-332-1000' },
  ZW: { emergencyServicesNumber: '999', helplineNumber: '+263-800-332-1000' },
  BW: { emergencyServicesNumber: '997', helplineNumber: '+267-800-332-1000' },
  NA: { emergencyServicesNumber: '10111', helplineNumber: '+264-800-332-1000' },
  SZ: { emergencyServicesNumber: '999', helplineNumber: '+268-800-332-1000' },
  LS: { emergencyServicesNumber: '121', helplineNumber: '+266-800-332-1000' },
  MW: { emergencyServicesNumber: '998', helplineNumber: '+265-800-332-1000' },
  MZ: { emergencyServicesNumber: '119', helplineNumber: '+258-800-332-1000' },
  MG: { emergencyServicesNumber: '117', helplineNumber: '+261-800-332-1000' },
  MU: { emergencyServicesNumber: '114', helplineNumber: '+230-800-332-1000' },
  SC: { emergencyServicesNumber: '999', helplineNumber: '+248-800-332-1000' },
  KM: { emergencyServicesNumber: '17', helplineNumber: '+269-800-332-1000' },
  RE: { emergencyServicesNumber: '15', helplineNumber: '+262-800-332-1000' },
  YT: { emergencyServicesNumber: '15', helplineNumber: '+262-800-332-1000' },
  SH: { emergencyServicesNumber: '999', helplineNumber: '+290-800-332-1000' },
  AC: { emergencyServicesNumber: '999', helplineNumber: '+247-800-332-1000' },
  TA: { emergencyServicesNumber: '999', helplineNumber: '+290-800-332-1000' },
  EH: { emergencyServicesNumber: '15', helplineNumber: '+212-800-332-1000' },
  DJ: { emergencyServicesNumber: '17', helplineNumber: '+253-800-332-1000' },
  SO: { emergencyServicesNumber: '999', helplineNumber: '+252-800-332-1000' },
  ER: { emergencyServicesNumber: '114', helplineNumber: '+291-800-332-1000' },
  UG: { emergencyServicesNumber: '999', helplineNumber: '+256-800-332-1000' },
  TZ: { emergencyServicesNumber: '112', helplineNumber: '+255-800-332-1000' },
  RW: { emergencyServicesNumber: '112', helplineNumber: '+250-800-332-1000' },
  BI: { emergencyServicesNumber: '112', helplineNumber: '+257-800-332-1000' },
  SS: { emergencyServicesNumber: '999', helplineNumber: '+211-800-332-1000' },
  GM: { emergencyServicesNumber: '16', helplineNumber: '+220-800-332-1000' },
  GW: { emergencyServicesNumber: '119', helplineNumber: '+245-800-332-1000' },
  GN: { emergencyServicesNumber: '18', helplineNumber: '+224-800-332-1000' },
  SL: { emergencyServicesNumber: '999', helplineNumber: '+232-800-332-1000' },
  LR: { emergencyServicesNumber: '911', helplineNumber: '+231-800-332-1000' },
  TG: { emergencyServicesNumber: '118', helplineNumber: '+228-800-332-1000' },
  BJ: { emergencyServicesNumber: '117', helplineNumber: '+229-800-332-1000' }
}

export default function EmergencyPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [country, setCountry] = useState<string>('US')

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const info = countryEmergencyMap[country]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Information</h1>
            <p className="text-gray-600">Select your country to see the correct emergency numbers.</p>
          </div>

          {/* Country Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Select Country</h2>
            </div>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Critical Emergency Notice */}
          <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-900">MEDICAL EMERGENCY</h2>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-900 mb-2">CALL {info.emergencyServicesNumber}</div>
              <p className="text-red-800 text-lg">If you&apos;re experiencing a medical emergency, call immediately.</p>
            </div>
          </div>

          {/* Two Cards Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Services Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Emergency Services</h3>
                      <p className="text-sm text-gray-600">Medical Emergency</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">HIGH</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{info.emergencyServicesNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">24/7</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(info.emergencyServicesNumber, 'emergency')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedKey === 'emergency' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>

            {/* Epilepsy Foundation Helpline Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Epilepsy Foundation Helpline</h3>
                      <p className="text-sm text-gray-600">Support & Information</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">24/7</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{info.helplineNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">Availability: 24/7</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(info.helplineNumber, 'helpline')}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {copiedKey === 'helpline' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Available 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Disclaimer</h3>
                <p className="text-yellow-800">
                  Numbers are provided for convenience and may vary by region or carrier. Always follow local guidance and consult healthcare providers.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
