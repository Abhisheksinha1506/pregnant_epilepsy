import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type ReportData = {
  id: string
  title: string
  description: string
  type: 'seizure' | 'medication' | 'pregnancy' | 'general'
  lastUpdated: string
  status: 'ready' | 'processing' | 'error'
  dataPoints: number
  icon: string
}

function safeReadText(filePath: string): string | null {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8')
    }
  } catch {
    // ignore
  }
  return null
}

function countCsvRows(csv: string): number {
  const lines = csv.split('\n').filter(l => l.trim().length > 0)
  if (lines.length <= 1) return 0
  return lines.length - 1
}

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), '..', 'data')

    // Seizures
    const seizureCsvPath = path.join(dataDir, 'seizure_tracking_log.csv')
    const seizureCsv = safeReadText(seizureCsvPath)
    const seizureCount = seizureCsv ? countCsvRows(seizureCsv) : 0

    // Medications
    const medsCsvPath = path.join(dataDir, 'epilepsy_medications.csv')
    const medsCsv = safeReadText(medsCsvPath)
    const medsCount = medsCsv ? countCsvRows(medsCsv) : 0

    // Pregnancy milestones
    const pregCsvPath = path.join(dataDir, 'pregnancy_tracking_schedule.csv')
    const pregCsv = safeReadText(pregCsvPath)
    const pregMilestones = pregCsv ? countCsvRows(pregCsv) : 0

    // Aggregate last updated from directory mtime
    let lastUpdated = new Date().toISOString().slice(0, 10)
    try {
      const stat = fs.statSync(dataDir)
      if (stat.mtime) lastUpdated = new Date(stat.mtime).toISOString().slice(0, 10)
    } catch {
      // ignore
    }

    const reports: ReportData[] = [
      {
        id: 'seizure',
        title: 'Seizure Activity Report',
        description: 'Counts and summaries computed from seizure_tracking_log.csv.',
        type: 'seizure',
        lastUpdated,
        status: 'ready',
        dataPoints: seizureCount,
        icon: 'activity'
      },
      {
        id: 'medication',
        title: 'Medication Adherence Report',
        description: 'Medication entries sourced from epilepsy_medications.csv.',
        type: 'medication',
        lastUpdated,
        status: 'ready',
        dataPoints: medsCount,
        icon: 'trending'
      },
      {
        id: 'pregnancy',
        title: 'Pregnancy Progress Report',
        description: 'Milestones from pregnancy_tracking_schedule.csv.',
        type: 'pregnancy',
        lastUpdated,
        status: 'ready',
        dataPoints: pregMilestones,
        icon: 'calendar'
      },
      {
        id: 'general',
        title: 'Comprehensive Health Summary',
        description: 'Combined counts across seizures, medications, and pregnancy data.',
        type: 'general',
        lastUpdated,
        status: 'ready',
        dataPoints: seizureCount + medsCount + pregMilestones,
        icon: 'file'
      }
    ]

    return NextResponse.json({ success: true, reports })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to build reports' }, { status: 500 })
  }
}


