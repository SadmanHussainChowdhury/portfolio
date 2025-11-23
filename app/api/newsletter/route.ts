import { NextRequest, NextResponse } from 'next/server'
import { db, getInitPromise } from '@/lib/db'
import { Subscriber } from '@/types'

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const body = await request.json()
    const { email, name, source } = body
    
    // Check if already subscribed
    const subscribers = await db.read<Subscriber>('subscribers')
    const existing = subscribers.find(s => s.email === email)
    
    if (existing && existing.status === 'active') {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 400 }
      )
    }
    
    const subscriber: Subscriber = {
      id: existing?.id || Date.now().toString(),
      email,
      name,
      subscribedAt: existing?.subscribedAt || new Date().toISOString(),
      status: 'active',
      source: source || 'website',
    }
    
    if (existing) {
      await db.update('subscribers', existing.id, subscriber)
    } else {
      await db.create('subscribers', subscriber)
    }
    
    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await getInitPromise()
    const subscribers = await db.read<Subscriber>('subscribers')
    const active = subscribers.filter(s => s.status === 'active')
    return NextResponse.json({
      total: subscribers.length,
      active: active.length,
      subscribers,
    })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }
}

