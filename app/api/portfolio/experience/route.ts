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
    const experiences = await db.read('experience')
    return NextResponse.json({ experiences })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await getInitPromise()
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experience = await request.json()
    const newExperience = {
      ...experience,
      id: experience.id || `exp-${Date.now()}`,
    }
    
    const created = await db.create('experience', newExperience)
    return NextResponse.json({ experience: created }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create experience' },
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

    const { id, ...updates } = await request.json()
    const updated = await db.update('experience', id, updates)
    
    if (!updated) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    return NextResponse.json({ experience: updated })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await getInitPromise()
    const isAuthenticated = request.cookies.get('admin-authenticated')?.value === 'true'
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const deleted = await db.delete('experience', id)
    if (!deleted) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}
