import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // This would typically load from a database
    // For now, return empty array as seizures are stored locally
    return NextResponse.json({ seizures: [] })
  } catch (error) {
    console.error('Error loading seizure data:', error)
    return NextResponse.json(
      { error: 'Failed to load seizure data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the seizure data
    const requiredFields = ['date', 'time', 'type', 'duration', 'severity']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // In a real app, this would save to a database
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Seizure logged successfully' 
    })
  } catch (error) {
    console.error('Error saving seizure data:', error)
    return NextResponse.json(
      { error: 'Failed to save seizure data' },
      { status: 500 }
    )
  }
}
