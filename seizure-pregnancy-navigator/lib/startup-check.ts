// Startup environment check
export function logEnvironmentStatus() {
  console.log('🚀 APPLICATION STARTUP - ENVIRONMENT CHECK')
  console.log('==========================================')
  
  // Core environment variables
  const coreVars = [
    'NODE_ENV',
    'VERCEL_REGION',
    'VERCEL_URL',
    'VERCEL_ENV'
  ]
  
  console.log('📋 Core Environment Variables:')
  coreVars.forEach(varName => {
    const value = process.env[varName]
    if (value) {
      console.log(`   ✅ ${varName}: ${value}`)
    } else {
      console.log(`   ❌ ${varName}: NOT SET`)
    }
  })
  
  // API Keys
  const apiKeys = [
    'OPENFDA_API_KEY',
    'NIH_API_KEY',
    'CDC_API_KEY'
  ]
  
  console.log('🔑 API Keys Status:')
  apiKeys.forEach(keyName => {
    const value = process.env[keyName]
    if (value) {
      console.log(`   ✅ ${keyName}: SET (${value.length} chars)`)
    } else {
      console.log(`   ❌ ${keyName}: NOT SET`)
    }
  })
  
  // API Base URLs
  const baseUrls = [
    'OPENFDA_BASE_URL',
    'NIH_BASE_URL',
    'CDC_BASE_URL'
  ]
  
  console.log('🌐 API Base URLs:')
  baseUrls.forEach(urlName => {
    const value = process.env[urlName]
    if (value) {
      console.log(`   ✅ ${urlName}: ${value}`)
    } else {
      console.log(`   ❌ ${urlName}: NOT SET`)
    }
  })
  
  // Count missing required variables
  const requiredVars = ['OPENFDA_API_KEY', 'NIH_API_KEY', 'CDC_API_KEY']
  const missingRequired = requiredVars.filter(varName => !process.env[varName])
  
  console.log('📊 SUMMARY:')
  console.log(`   Total Environment Variables: ${Object.keys(process.env).length}`)
  console.log(`   Required API Keys: ${requiredVars.length}`)
  console.log(`   Missing Required: ${missingRequired.length}`)
  
  if (missingRequired.length > 0) {
    console.log('⚠️  MISSING REQUIRED VARIABLES:')
    missingRequired.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    console.log('💡 TIP: Set these variables in Vercel dashboard under Settings > Environment Variables')
  } else {
    console.log('✅ All required environment variables are present!')
  }
  
  console.log('==========================================')
  console.log('🚀 STARTUP CHECK COMPLETED')
}

// Run startup check immediately
logEnvironmentStatus()
