import { NextRequest, NextResponse } from 'next/server'
import { CDCService } from '@/lib/api-services'

const cdcService = new CDCService()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
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
