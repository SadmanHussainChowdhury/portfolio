import { NextRequest, NextResponse } from 'next/server'
import { db, initializeDB } from '@/lib/db'

let initialized = false
if (!initialized) {
  initializeDB()
  initialized = true
}

export async function GET() {
  try {
    const config = db.read('config')
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
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    const config = db.read<{ id?: string }>('config')
    
    if (config.length === 0) {
      db.create('config', { ...updates, id: 'config' })
    } else {
      const configId = (config[0] as { id?: string }).id || 'config'
      db.update('config', configId, updates)
    }
    
    const updated = db.read('config')[0]
    return NextResponse.json({ config: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
}

