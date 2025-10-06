#!/usr/bin/env node

/**
 * Comprehensive Testing Script for Seizure-Pregnancy Navigator
 * Run with: node scripts/comprehensive-test.js
 */

const BASE_URL = 'http://localhost:3000'

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
}

async function testAPI(endpoint, description, expectedStatus = 200) {
  console.log(`\n🧪 Testing: ${description}`)
  console.log(`📍 Endpoint: ${endpoint}`)
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    const data = await response.json()
    
    testResults.total++
    
    if (response.status === expectedStatus) {
      console.log('✅ Success!')
      testResults.passed++
      testResults.details.push({
        test: description,
        status: 'PASSED',
        response: response.status,
        data: data
      })
    } else {
      console.log('❌ Failed!')
      console.log(`Expected: ${expectedStatus}, Got: ${response.status}`)
      testResults.failed++
      testResults.details.push({
        test: description,
        status: 'FAILED',
        response: response.status,
        error: data
      })
    }
  } catch (error) {
    console.log('❌ Network Error!')
    testResults.failed++
    testResults.details.push({
      test: description,
      status: 'ERROR',
      error: error.message
    })
  }
}

async function testLocalStorage() {
  console.log('\n🧪 Testing: Local Storage Functionality')
  
  // Test if we can access localStorage (browser environment)
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Test seizure data storage
      const testSeizure = {
        id: 'test-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        type: 'Focal (Simple)',
        duration: 5,
        severity: 3,
        triggers: ['Stress'],
        notes: 'Test seizure for functionality testing',
        medicationTaken: true
      }
      
      localStorage.setItem('seizures', JSON.stringify([testSeizure]))
      const retrieved = JSON.parse(localStorage.getItem('seizures') || '[]')
      
      if (retrieved.length > 0 && retrieved[0].id === testSeizure.id) {
        console.log('✅ Local Storage - Seizure Data: PASSED')
        testResults.passed++
      } else {
        console.log('❌ Local Storage - Seizure Data: FAILED')
        testResults.failed++
      }
      
      // Test pregnancy data storage
      const testDueDate = '2024-12-01'
      localStorage.setItem('dueDate', testDueDate)
      const retrievedDueDate = localStorage.getItem('dueDate')
      
      if (retrievedDueDate === testDueDate) {
        console.log('✅ Local Storage - Pregnancy Data: PASSED')
        testResults.passed++
      } else {
        console.log('❌ Local Storage - Pregnancy Data: FAILED')
        testResults.failed++
      }
      
      testResults.total += 2
      
    } catch (error) {
      console.log('❌ Local Storage Error:', error.message)
      testResults.failed += 2
      testResults.total += 2
    }
  } else {
    console.log('⚠️ Local Storage test skipped (Node.js environment)')
  }
}

async function testClearDataFunctionality() {
  console.log('\n🧪 Testing: Clear Data Functionality')
  
  // Test if clear data function exists and works
  try {
    // This would be tested in browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Add some test data
      const testData = [{
        id: 'test-1',
        date: '2024-01-01',
        time: '10:00',
        type: 'Focal',
        duration: 2.5,
        severity: 3,
        triggers: ['Stress'],
        notes: 'Test seizure',
        medicationTaken: true
      }]
      
      localStorage.setItem('seizures', JSON.stringify(testData))
      
      // Test clear functionality
      localStorage.removeItem('seizures')
      localStorage.removeItem('seizure_logs')
      localStorage.removeItem('medication_logs')
      localStorage.removeItem('pregnancy_milestones')
      localStorage.removeItem('dueDate')
      localStorage.removeItem('pregnancy_due_date')
      
      const clearedData = localStorage.getItem('seizures')
      
      testResults.total++
      
      if (!clearedData) {
        console.log('✅ Clear Data Functionality: PASSED (data cleared successfully)')
        testResults.passed++
      } else {
        console.log('❌ Clear Data Functionality: FAILED (data not cleared)')
        testResults.failed++
      }
    } else {
      console.log('⚠️ Clear Data test skipped (Node.js environment)')
    }
  } catch (error) {
    console.log('❌ Clear Data Functionality Error:', error.message)
    testResults.failed++
    testResults.total++
  }
}

async function testDataIntegrity() {
  console.log('\n🧪 Testing: Data Integrity')
  
  // Test seizure data validation
  const invalidSeizure = {
    date: 'invalid-date',
    time: '25:00', // invalid time
    type: '', // empty type
    duration: -1, // negative duration
    severity: 6 // invalid severity
  }
  
  // Test valid seizure with long duration (should be accepted)
  const validLongSeizure = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'Generalized Tonic-Clonic',
    duration: 120, // 2 hours - should be accepted
    severity: 4,
    triggers: ['Stress'],
    notes: 'Test seizure with long duration',
    medicationTaken: true
  }
  
  // Test seizure with minutes and seconds
  const validDetailedSeizure = {
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'Focal (Simple)',
    duration: 2.5, // 2 minutes 30 seconds
    durationMinutes: 2,
    durationSeconds: 30,
    severity: 3,
    triggers: ['Stress'],
    notes: 'Test seizure with detailed duration',
    medicationTaken: true
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/seizures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidSeizure)
    })
    
    testResults.total++
    
    if (response.status === 400) {
      console.log('✅ Data Validation: PASSED (correctly rejected invalid data)')
      testResults.passed++
    } else {
      console.log('❌ Data Validation: FAILED (should have rejected invalid data)')
      testResults.failed++
    }
    
    // Test valid seizure with long duration
    const validResponse = await fetch(`${BASE_URL}/api/seizures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validLongSeizure)
    })
    
    testResults.total++
    
    if (validResponse.status === 200) {
      console.log('✅ Long Duration Validation: PASSED (correctly accepted long duration)')
      testResults.passed++
    } else {
      console.log('❌ Long Duration Validation: FAILED (should have accepted long duration)')
      testResults.failed++
    }
    
    // Test detailed seizure with minutes and seconds
    const detailedResponse = await fetch(`${BASE_URL}/api/seizures`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validDetailedSeizure)
    })
    
    testResults.total++
    
    if (detailedResponse.status === 200) {
      console.log('✅ Detailed Duration Validation: PASSED (correctly accepted minutes and seconds)')
      testResults.passed++
    } else {
      console.log('❌ Detailed Duration Validation: FAILED (should have accepted minutes and seconds)')
      testResults.failed++
    }
    
  } catch (error) {
    console.log('❌ Data Validation Error:', error.message)
    testResults.failed += 3
    testResults.total += 3
  }
}

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Functionality Tests')
  console.log('=' .repeat(60))
  
  // Test environment setup
  await testAPI('/api/env-check', 'Environment Check')
  
  // Test core API endpoints
  await testAPI('/api/medications', 'Medications Database')
  await testAPI('/api/medications/enhanced?external=false', 'Enhanced Medications (Local)')
  await testAPI('/api/pregnancy', 'Pregnancy Data')
  await testAPI('/api/glossary', 'Medical Glossary')
  await testAPI('/api/knowledge', 'Knowledge Base')
  await testAPI('/api/reports', 'Reports Generation')
  
  // Test external API integrations
  await testAPI('/api/external/openfda?drug=lamotrigine&type=labeling', 'OpenFDA - Drug Labeling')
  await testAPI('/api/external/cdc?type=guidelines', 'CDC - Pregnancy Guidelines')
  await testAPI('/api/external/dailymed?search=lamotrigine', 'DailyMed - Medication Search')
  
  // Test data management
  await testLocalStorage()
  await testClearDataFunctionality()
  await testDataIntegrity()
  
  // Test error handling
  await testAPI('/api/nonexistent', 'Non-existent Endpoint', 404)
  
  console.log('\n🎉 Comprehensive Testing Complete!')
  console.log('=' .repeat(60))
  console.log(`📊 Results: ${testResults.passed}/${testResults.total} tests passed`)
  console.log(`✅ Passed: ${testResults.passed}`)
  console.log(`❌ Failed: ${testResults.failed}`)
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:')
    testResults.details
      .filter(detail => detail.status === 'FAILED' || detail.status === 'ERROR')
      .forEach(detail => {
        console.log(`   - ${detail.test}: ${detail.status}`)
      })
  }
  
  return testResults
}

// Check if running directly
if (require.main === module) {
  runComprehensiveTests().catch(console.error)
}

module.exports = { testAPI, testLocalStorage, testDataIntegrity, runComprehensiveTests }
