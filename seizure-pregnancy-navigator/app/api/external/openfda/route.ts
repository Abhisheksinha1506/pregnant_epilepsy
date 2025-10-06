import { NextRequest, NextResponse } from 'next/server'
import { OpenFDAService } from '@/lib/api-services'

const openFDAService = new OpenFDAService()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    // Log environment status
    console.log('🔍 OpenFDA API - Environment Check:')
    console.log(`   OPENFDA_API_KEY: ${process.env.OPENFDA_API_KEY ? 'SET' : 'NOT SET'}`)
    console.log(`   OPENFDA_BASE_URL: ${process.env.OPENFDA_BASE_URL || 'NOT SET'}`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`)
    console.log(`   VERCEL_REGION: ${process.env.VERCEL_REGION}`)

    const { searchParams } = request.nextUrl
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
    } else if (type === 'recalls') {
      data = await openFDAService.getDrugRecalls(drugName)
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "labeling", "adverse", or "recalls"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'OpenFDA API',
      timestamp: new Date().toISOString(),
      drug: drugName,
      type
    })

  } catch (error) {
    console.error('OpenFDA API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from OpenFDA',
        details: error instanceof Error ? error.message : 'Unknown error',
        source: 'OpenFDA API'
      },
      { status: 500 }
    )
  }
}
