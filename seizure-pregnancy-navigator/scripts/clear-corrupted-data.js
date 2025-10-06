#!/usr/bin/env node

/**
 * Script to clear corrupted localStorage data
 * Run with: node scripts/clear-corrupted-data.js
 */

console.log('🧹 Clearing Corrupted localStorage Data')
console.log('=' .repeat(50))

// Function to clear localStorage data
function clearLocalStorageData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Clear all seizure-related data
    localStorage.removeItem('seizures')
    localStorage.removeItem('seizure_logs')
    localStorage.removeItem('medication_logs')
    localStorage.removeItem('pregnancy_milestones')
    localStorage.removeItem('dueDate')
    localStorage.removeItem('pregnancy_due_date')
    localStorage.removeItem('pregnancy_start_date')
    localStorage.removeItem('pregnancy_start_date_type')
    localStorage.removeItem('pregnancy_status')
    
    console.log('✅ Cleared all localStorage data')
    console.log('✅ Removed corrupted seizure data')
    console.log('✅ Removed medication logs')
    console.log('✅ Removed pregnancy data')
    
    return true
  } else {
    console.log('⚠️ localStorage not available (Node.js environment)')
    console.log('💡 To clear data in browser:')
    console.log('   1. Open browser developer tools (F12)')
    console.log('   2. Go to Application/Storage tab')
    console.log('   3. Find localStorage for your domain')
    console.log('   4. Delete all keys or clear all data')
    return false
  }
}

// Function to validate seizure data
function validateSeizureData(seizure) {
  const issues = []
  
  // Check for extreme duration values
  if (seizure.durationMinutes > 60) {
    issues.push(`Minutes too high: ${seizure.durationMinutes} (max: 60)`)
  }
  
  if (seizure.durationSeconds > 59) {
    issues.push(`Seconds too high: ${seizure.durationSeconds} (max: 59)`)
  }
  
  if (seizure.duration > 60) {
    issues.push(`Total duration too high: ${seizure.duration} minutes`)
  }
  
  // Check for negative values
  if (seizure.durationMinutes < 0) {
    issues.push(`Negative minutes: ${seizure.durationMinutes}`)
  }
  
  if (seizure.durationSeconds < 0) {
    issues.push(`Negative seconds: ${seizure.durationSeconds}`)
  }
  
  return issues
}

// Function to clean and validate existing data
function cleanExistingData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const seizuresData = localStorage.getItem('seizures')
      if (seizuresData) {
        const seizures = JSON.parse(seizuresData)
        console.log(`📊 Found ${seizures.length} seizures in localStorage`)
        
        const validSeizures = []
        const corruptedSeizures = []
        
        seizures.forEach((seizure, index) => {
          const issues = validateSeizureData(seizure)
          if (issues.length > 0) {
            console.log(`❌ Seizure ${index + 1} has issues:`, issues)
            corruptedSeizures.push(seizure)
          } else {
            validSeizures.push(seizure)
          }
        })
        
        if (corruptedSeizures.length > 0) {
          console.log(`🧹 Found ${corruptedSeizures.length} corrupted seizures`)
          console.log('💡 Recommendation: Clear all data and start fresh')
          
          // Ask user if they want to clear data
          const shouldClear = confirm(`Found ${corruptedSeizures.length} corrupted seizures. Clear all data?`)
          if (shouldClear) {
            clearLocalStorageData()
            return true
          }
        } else {
          console.log('✅ All seizure data appears to be valid')
        }
      } else {
        console.log('📭 No seizure data found in localStorage')
      }
    } catch (error) {
      console.log('❌ Error reading localStorage data:', error.message)
      console.log('💡 Clearing all data due to corruption')
      clearLocalStorageData()
      return true
    }
  }
  
  return false
}

// Main execution
if (require.main === module) {
  console.log('🔍 Checking for corrupted data...')
  
  if (typeof window !== 'undefined') {
    // Browser environment
    const cleared = cleanExistingData()
    if (cleared) {
      console.log('✅ Data cleanup completed')
    } else {
      console.log('✅ No corrupted data found')
    }
  } else {
    // Node.js environment
    console.log('💡 This script should be run in the browser console:')
    console.log('')
    console.log('1. Open your application in the browser')
    console.log('2. Open Developer Tools (F12)')
    console.log('3. Go to Console tab')
    console.log('4. Copy and paste this code:')
    console.log('')
    console.log(`
// Clear all localStorage data
localStorage.removeItem('seizures')
localStorage.removeItem('seizure_logs')
localStorage.removeItem('medication_logs')
localStorage.removeItem('pregnancy_milestones')
localStorage.removeItem('dueDate')
localStorage.removeItem('pregnancy_due_date')
localStorage.removeItem('pregnancy_start_date')
localStorage.removeItem('pregnancy_start_date_type')
localStorage.removeItem('pregnancy_status')
console.log('✅ All localStorage data cleared')
    `)
  }
}

module.exports = { clearLocalStorageData, validateSeizureData, cleanExistingData }
