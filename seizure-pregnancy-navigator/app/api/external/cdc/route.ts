import { NextRequest, NextResponse } from 'next/server'
import { CDCService } from '@/lib/api-services'

const cdcService = new CDCService()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    // Log environment status
    console.log('🔍 CDC API - Environment Check:')
    console.log(`   CDC_API_KEY: ${process.env.CDC_API_KEY ? 'SET' : 'NOT SET'}`)
    console.log(`   CDC_BASE_URL: ${process.env.CDC_BASE_URL || 'NOT SET'}`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`   VERCEL_REGION: ${process.env.VERCEL_REGION}`)

    const { searchParams } = request.nextUrl
    const type = searchParams.get('type') || 'guidelines'

    let data
    if (type === 'guidelines') {
      data = await cdcService.getPregnancyGuidelines()
    } else if (type === 'reproductive') {
      data = await cdcService.getReproductiveHealthData()
    } else if (type === 'maternal') {
      data = await cdcService.getMaternalHealthData()
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "guidelines", "reproductive", or "maternal"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'CDC API',
      timestamp: new Date().toISOString(),
      type
    })

  } catch (error) {
    console.error('CDC API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from CDC',
        details: error instanceof Error ? error.message : 'Unknown error',
        source: 'CDC API'
      },
      { status: 500 }
    )
  }
}
