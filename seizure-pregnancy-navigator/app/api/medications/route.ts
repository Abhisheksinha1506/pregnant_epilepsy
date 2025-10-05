import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Try to load from comprehensive database first
    const comprehensivePath = path.join(process.cwd(), '..', 'data', 'comprehensive_epilepsy_medications.json')
    
    if (fs.existsSync(comprehensivePath)) {
      const data = JSON.parse(fs.readFileSync(comprehensivePath, 'utf8'))
      return NextResponse.json(data)
    }
    
    // Fallback to original database
    const dataPath = path.join(process.cwd(), '..', 'data', 'epilepsy_medication_safety_database.json')
    
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      return NextResponse.json(data)
    }
    
    // Final fallback to static data if no files exist
    const fallbackData = {
      source: "Fallback Medication Database",
      description: "Basic epilepsy medication safety information",
      medications: [
        {
          medication: "Lamotrigine",
          brand_names: ["Lamictal"],
          pregnancy_category: "Category C",
          safety_profile: "Generally considered safer during pregnancy",
          key_points: [
            "Lower risk of major congenital malformations compared to valproate",
            "May require dose adjustments during pregnancy",
            "Therapeutic drug monitoring recommended",
            "Considered safe for breastfeeding"
          ],
          monitoring: [
            "Regular blood level monitoring",
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks"
          ]
        },
        {
          medication: "Levetiracetam",
          brand_names: ["Keppra"],
          pregnancy_category: "Category C",
          safety_profile: "Generally considered safer during pregnancy",
          key_points: [
            "Lower risk of major congenital malformations",
            "Good seizure control during pregnancy",
            "May require dose adjustments",
            "Considered safe for breastfeeding"
          ],
          monitoring: [
            "Regular blood level monitoring",
            "Folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks"
          ]
        },
        {
          medication: "Valproic Acid",
          brand_names: ["Depakote", "Depakene"],
          pregnancy_category: "Category D",
          safety_profile: "Higher risk during pregnancy",
          key_points: [
            "Highest risk of major congenital malformations (10-11%)",
            "Increased risk of neurodevelopmental problems",
            "Should be avoided if possible during pregnancy",
            "If necessary, use lowest effective dose"
          ],
          monitoring: [
            "High-dose folic acid supplementation (5mg daily)",
            "Detailed anomaly scan at 18-20 weeks",
            "Consider alternative medications if possible",
            "Close monitoring for birth defects"
          ]
        }
      ]
    }
    
    return NextResponse.json(fallbackData)
  } catch (error) {
    console.error('Error loading medication data:', error)
    return NextResponse.json(
      { error: 'Failed to load medication data' },
      { status: 500 }
    )
  }
}
