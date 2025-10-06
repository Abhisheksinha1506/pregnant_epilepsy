import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { OpenFDAService } from '@/lib/api-services'

const openFDAService = new OpenFDAService()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const drugName = searchParams.get('drug')
    const includeExternal = searchParams.get('external') === 'true'

    // Load local data first
    const dataPath = path.join(process.cwd(), '..', 'data', 'epilepsy_medication_safety_database.json')
    let localData = {}
    
    if (fs.existsSync(dataPath)) {
      localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    }

    // If external data is requested and drug name is provided
    if (includeExternal && drugName) {
      try {
        const [labelingData, adverseData] = await Promise.allSettled([
          openFDAService.getDrugLabeling(drugName),
          openFDAService.getAdverseEvents(drugName)
        ])

        const externalData = {
          labeling: labelingData.status === 'fulfilled' ? labelingData.value : null,
          adverse: adverseData.status === 'fulfilled' ? adverseData.value : null,
          errors: {
            labeling: labelingData.status === 'rejected' ? labelingData.reason.message : null,
            adverse: adverseData.status === 'rejected' ? adverseData.reason.message : null
          }
        }
        
        return NextResponse.json({
          success: true,
          local: localData,
          external: {
            source: 'OpenFDA API',
            data: externalData,
            timestamp: new Date().toISOString(),
            drug: drugName
          }
        })
      } catch (externalError) {
        console.warn('External API failed, returning local data only:', externalError)
        return NextResponse.json({
          success: true,
          local: localData,
          external: {
            error: 'External API unavailable',
            fallback: true,
            details: externalError instanceof Error ? externalError.message : 'Unknown error'
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      local: localData,
      external: null
    })

  } catch (error) {
    console.error('Error loading medication data:', error)
    return NextResponse.json(
      { error: 'Failed to load medication data' },
      { status: 500 }
    )
  }
}
