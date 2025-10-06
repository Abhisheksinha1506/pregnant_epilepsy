import { NextResponse } from 'next/server'
import '@/lib/startup-check' // This will run the startup check

export const runtime = 'nodejs'
export const maxDuration = 10

export async function GET() {
  try {
    console.log('🔍 ENVIRONMENT CHECK STARTED')
    console.log('=====================================')
    
    // List of expected environment variables
    const expectedEnvVars = [
      'NODE_ENV',
      'OPENFDA_API_KEY',
      'NIH_API_KEY', 
      'CDC_API_KEY',
      'OPENFDA_BASE_URL',
      'NIH_BASE_URL',
      'CDC_BASE_URL',
      'CUSTOM_KEY'
    ]

    console.log('📋 Expected Environment Variables:', expectedEnvVars)

    // Check which environment variables are present
    const envStatus = expectedEnvVars.map(envVar => {
      const isPresent = !!process.env[envVar]
      const value = process.env[envVar]
      const maskedValue = value ? 
        (envVar.includes('KEY') || envVar.includes('SECRET') ? 
          `${value.substring(0, 8)}...` : 
          value) : 
        null
      
      // Log each variable status
      if (isPresent) {
        console.log(`✅ ${envVar}: ${maskedValue} (${value?.length || 0} chars)`)
      } else {
        console.log(`❌ ${envVar}: NOT SET`)
      }
      
      return {
        name: envVar,
        present: isPresent,
        value: maskedValue,
        length: value?.length || 0
      }
    })

    // Get all environment variables (filtered for security)
    const allEnvVars = Object.keys(process.env)
      .filter(key => 
        !key.includes('SECRET') && 
        !key.includes('PASSWORD') && 
        !key.includes('TOKEN') &&
        !key.includes('KEY') &&
        key.startsWith('VERCEL_') || 
        key.startsWith('NEXT_') ||
        key === 'NODE_ENV'
      )
      .reduce((acc, key) => {
        acc[key] = process.env[key]
        return acc
      }, {} as Record<string, string>)

    // Count missing required variables
    const missingRequired = envStatus.filter(env => 
      ['OPENFDA_API_KEY', 'NIH_API_KEY', 'CDC_API_KEY'].includes(env.name) && !env.present
    )

    console.log('📊 ENVIRONMENT SUMMARY:')
    console.log(`   Total Variables Checked: ${envStatus.length}`)
    console.log(`   Present: ${envStatus.filter(env => env.present).length}`)
    console.log(`   Missing: ${envStatus.filter(env => !env.present).length}`)
    console.log(`   Missing Required: ${missingRequired.length}`)
    
    if (missingRequired.length > 0) {
      console.log('⚠️  MISSING REQUIRED VARIABLES:')
      missingRequired.forEach(env => {
        console.log(`   - ${env.name}`)
      })
    } else {
      console.log('✅ All required variables are present!')
    }

    const finalStatus = missingRequired.length === 0 ? 'HEALTHY' : 'WARNING'
    
    console.log('🎯 FINAL STATUS:', finalStatus)
    console.log('=====================================')
    console.log('🔍 ENVIRONMENT CHECK COMPLETED')
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      vercelUrl: process.env.VERCEL_URL,
      expectedVariables: envStatus,
      missingRequired: missingRequired.length,
      missingRequiredVars: missingRequired.map(env => env.name),
      allEnvironmentVars: allEnvVars,
      totalEnvVars: Object.keys(process.env).length,
      status: finalStatus
    })

  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
