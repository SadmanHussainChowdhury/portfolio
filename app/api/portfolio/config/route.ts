import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

// Initialize DB on first request - use singleton pattern
let initPromise: Promise<void> | null = null
const getInitPromise = () => {
  if (!initPromise) {
    initPromise = initializeDB()
  }
  return initPromise
}

export async function GET() {
  try {
    await getInitPromise()
    const config = await db.read('config')
    return NextResponse.json({ config: config[0] || {} })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await getInitPromise()
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const config = await db.read<{ id?: string }>('config')
    
    if (config.length === 0) {
      await db.create('config', { ...updates, id: 'config' })
    } else {
      const configId = (config[0] as { id?: string }).id || 'config'
      await db.update('config', configId, updates)
    }
    
    const updated = await db.read('config')
    return NextResponse.json({ config: updated[0] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
}
