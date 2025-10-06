import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET() {
  try {
    // Try to load from data directory first
    const dataPath = path.join(process.cwd(), 'data', 'medical_terms_glossary.json')
    
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8')
      const glossaryData = JSON.parse(fileContent)
      
      return NextResponse.json(glossaryData)
    }

    // Fallback to static data if file doesn't exist
    const fallbackData = {
      source: "Medical Terms Glossary",
      description: "Comprehensive glossary of epilepsy and pregnancy-related medical terms",
      total_terms: 10,
      categories: [
        "Medications & Pharmacology",
        "Healthcare Providers", 
        "Epilepsy & Seizures",
        "Pregnancy & Maternal Health"
      ],
      terms: [
        {
          term: "AED",
          definition: "Anti-Epileptic Drug. Medications used to treat epilepsy and prevent seizures.",
          full_form: "Anti-Epileptic Drug",
          category: "Medications & Pharmacology",
          related_terms: ["ASM", "anticonvulsant", "seizure medication"],
          example: "Common AEDs include lamotrigine, levetiracetam, and valproic acid."
        },
        {
          term: "ASM",
          definition: "Anti-Seizure Medication. Another term for anti-epileptic drugs used to control seizures.",
          full_form: "Anti-Seizure Medication",
          category: "Medications & Pharmacology",
          related_terms: ["AED", "anticonvulsant", "seizure medication"],
          example: "ASMs are carefully monitored during pregnancy for safety."
        },
        {
          term: "Teratogenicity",
          definition: "The ability of a substance to cause birth defects or developmental abnormalities in a developing fetus.",
          category: "Medications & Pharmacology",
          related_terms: ["birth defects", "developmental toxicity", "fetal risk"],
          example: "The teratogenicity of AEDs varies significantly between different medications."
        },
        {
          term: "MFM",
          definition: "Maternal-Fetal Medicine. A medical specialty that focuses on high-risk pregnancies and complex maternal and fetal conditions.",
          full_form: "Maternal-Fetal Medicine",
          category: "Healthcare Providers",
          related_terms: ["perinatologist", "high-risk pregnancy", "fetal medicine"],
          example: "Women with epilepsy may be referred to an MFM specialist during pregnancy."
        },
        {
          term: "Polytherapy",
          definition: "The use of multiple anti-epileptic drugs simultaneously to control seizures.",
          category: "Medications & Pharmacology",
          related_terms: ["combination therapy", "multiple AEDs", "drug interactions"],
          example: "Polytherapy during pregnancy increases the complexity of medication management."
        }
      ]
    }

    return NextResponse.json(fallbackData)

  } catch (error) {
    console.error('Error loading glossary data:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load glossary data',
        terms: []
      },
      { status: 500 }
    )
  }
}
