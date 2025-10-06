import { NextRequest, NextResponse } from 'next/server'
import { DailyMedService } from '@/lib/api-services'

const dailyMedService = new DailyMedService()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const ndc = searchParams.get('ndc')
    const search = searchParams.get('search')

    if (!ndc && !search) {
      return NextResponse.json(
        { error: 'NDC code or search term is required' },
        { status: 400 }
      )
    }

    let data
    if (ndc) {
      data = await dailyMedService.getMedicationInfo(ndc)
    } else if (search) {
      data = await dailyMedService.searchMedications(search)
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'NIH DailyMed API',
      timestamp: new Date().toISOString(),
      query: ndc || search
    })

  } catch (error) {
    console.error('DailyMed API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from DailyMed',
        details: error instanceof Error ? error.message : 'Unknown error',
        source: 'NIH DailyMed API'
      },
      { status: 500 }
    )
  }
}
