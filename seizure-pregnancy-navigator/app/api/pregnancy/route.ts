import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET() {
  try {
    // Load pregnancy data from our collected data files
    const dataPath = path.join(process.cwd(), '..', 'data', 'comprehensive_pregnancy_data.json')
    
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      return NextResponse.json(data)
    }
    
    // Fallback to static data if file doesn't exist
    const fallbackData = {
      pregnancy_info: [
        {
          title: "First Trimester (Weeks 1-12)",
          content: [
            "Continue taking prescribed epilepsy medications",
            "Start folic acid supplementation (5mg daily)",
            "Schedule pre-pregnancy counseling if not done",
            "Regular monitoring of medication levels",
            "Detailed anomaly scan at 18-20 weeks"
          ]
        },
        {
          title: "Second Trimester (Weeks 13-26)",
          content: [
            "Continue medication monitoring",
            "Detailed anomaly scan at 18-20 weeks",
            "Monitor for any seizure changes",
            "Regular OB-GYN and neurologist appointments",
            "Consider vitamin K supplementation in last month"
          ]
        },
        {
          title: "Third Trimester (Weeks 27-40)",
          content: [
            "Final preparations for delivery",
            "Discuss birth plan with healthcare team",
            "Monitor for any seizure changes",
            "Prepare for postpartum medication adjustments",
            "Emergency contact information ready"
          ]
        }
      ]
    }
    
    return NextResponse.json(fallbackData)
  } catch (error) {
    console.error('Error loading pregnancy data:', error)
    return NextResponse.json(
      { error: 'Failed to load pregnancy data' },
      { status: 500 }
    )
  }
}
