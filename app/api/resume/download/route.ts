import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const { ip, userAgent, referrer } = body
    
    // Track download
    const downloads = await db.read('resumeDownloads')
    const download = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ip,
      userAgent,
      referrer,
    }
    await db.create('resumeDownloads', download)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await getInitPromise()
    const downloads = await db.read('resumeDownloads')
    return NextResponse.json({
      total: downloads.length,
      downloads,
    })
  } catch (error) {
    console.error('Error fetching downloads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch downloads' },
      { status: 500 }
    )
  }
}

