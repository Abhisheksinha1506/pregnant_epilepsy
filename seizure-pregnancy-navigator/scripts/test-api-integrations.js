#!/usr/bin/env node

/**
 * Test script for API integrations
 * Run with: node scripts/test-api-integrations.js
 */

const BASE_URL = 'http://localhost:3000'

async function testAPI(endpoint, description) {
  console.log(`\n🧪 Testing: ${description}`)
  console.log(`📍 Endpoint: ${endpoint}`)
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Success!')
      console.log(`📊 Response:`, JSON.stringify(data, null, 2))
    } else {
      console.log('❌ Failed!')
      console.log(`📊 Error:`, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.log('❌ Network Error!')
    console.log(`📊 Error:`, error.message)
  }
}

async function runTests() {
  console.log('🚀 Starting API Integration Tests')
  console.log('=' .repeat(50))
  
  // Test OpenFDA API
  await testAPI(
    '/api/external/openfda?drug=lamotrigine&type=labeling',
    'OpenFDA - Drug Labeling'
  )
  
  await testAPI(
    '/api/external/openfda?drug=lamotrigine&type=adverse',
    'OpenFDA - Adverse Events'
  )
  
  // Test DailyMed API
  await testAPI(
    '/api/external/dailymed?search=lamotrigine',
    'DailyMed - Search Medications'
  )
  
  // Test CDC API
  await testAPI(
    '/api/external/cdc?type=guidelines',
    'CDC - Pregnancy Guidelines'
  )
  
  // Test Enhanced Medications API
  await testAPI(
    '/api/medications/enhanced?external=true&drug=lamotrigine',
    'Enhanced Medications - With External Data'
  )
  
  await testAPI(
    '/api/medications/enhanced?external=false&drug=lamotrigine',
    'Enhanced Medications - Local Data Only'
  )
  
  console.log('\n🎉 API Integration Tests Complete!')
  console.log('=' .repeat(50))
}

// Check if running directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testAPI, runTests }
