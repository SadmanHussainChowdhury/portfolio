import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'
import { Analytics } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const analytics: Analytics = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...body,
    }
    await db.create('analytics', analytics)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording analytics:', error)
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await getInitPromise()
    const analytics = await db.read<Analytics>('analytics')
    
    // Calculate stats
    const totalViews = analytics.reduce((sum, a) => sum + a.pageViews, 0)
    const totalVisitors = new Set(analytics.map(a => a.date)).size
    const recentAnalytics = analytics.slice(-30) // Last 30 days
    
    return NextResponse.json({
      totalViews,
      totalVisitors,
      recentAnalytics,
      analytics,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

